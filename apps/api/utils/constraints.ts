import type { Response } from '@nodevault/platform.components.api.server'
import type { Context } from '@nodevault/platform.components.context'
import { UniqueConstraint } from '@nodevault/platform.components.ravendb'
import { invariantCultureCompare } from '@nodevault/platform.components.utils'
import { User } from '@nodevault/platform.components.domain'

export class UserUniqueConstraints {
  response: Response | null = null
  email: UniqueConstraint<string> | null = null

  async release() {
    if (this.email) await this.email.release()
  }
}

export class UserPatchingUniqueConstraints {
  response: Response | null = null
  email: UniqueConstraint<string> | null = null
  currentEmail: UniqueConstraint<string> | null = null

  async release() {
    if (this.email) await this.email.release()
  }

  async releaseCurrent() {
    if (this.currentEmail) await this.currentEmail.release()
  }
}

const acquireConstraint = async (context: Context, userId: string, prefix: string, key: string) => {
  const uniqueConstraint = new UniqueConstraint<string>(context.session.database.advanced.documentStore, prefix, key)

  return (await uniqueConstraint.acquire(User.id(userId))) ? uniqueConstraint : null
}

/**
 * Used to manage unique contraints when creating a user, takes care of all rollbacks via session and context events
 * @param context
 * @param userId
 * @param email
 * @param phone
 * @returns
 */
export const acquireUniqueConstraints = async (
  context: Context,
  userId: string,
  email: string,
): Promise<UserUniqueConstraints> => {
  const constraints = new UserUniqueConstraints()

  constraints.email = await acquireConstraint(context, userId, 'Emails', email)

  if (!constraints.email) {
    constraints.response = context.event.response.badRequestCustom('email', `The email provided is already in use ${email}`, 409)
    return constraints
  }

  // if the process fails anywhere make sure we release the new constraints if the session has not commitedd
  context.on('error', async (ctx) => {
    if (!ctx.session.commited) {
      await constraints.release()
    }
  })

  return constraints
}

/**
 * Used to manage unique contraints when updating a user, takes care of all rollbacks via session and context events
 * @param context
 * @param userId
 * @param email
 * @param currentEmail
 * @returns
 */
export const acquireUniqueConstraintsForPatching = async (
  context: Context,
  userId: string,
  email: string,
  currentEmail: string,
): Promise<UserPatchingUniqueConstraints> => {
  const constraints = new UserPatchingUniqueConstraints()

  // if the user is updating their email get a handle on the existing
  // constraint and try to acquire the new one
  if (email && !invariantCultureCompare(email, currentEmail)) {
    constraints.currentEmail = new UniqueConstraint<string>(
      context.session.database.advanced.documentStore,
      'Emails',
      currentEmail,
    )

    constraints.email = await acquireConstraint(context, userId, 'Emails', email)

    // if the constraint is null, its taken so return appropriate response
    if (!constraints.email) {
      constraints.response = context.event.response.badRequestCustom('email', 'The email provided is already in use', 409)
      return constraints
    }
  }

  // if session commits successfully release current constraints
  context.session.on('afterCommit', async () => await constraints.releaseCurrent())

  // if the process fails anywhere make sure we release the new constraints, unless the sesssion committed
  // in which case we should retain them as the changes would have been applied to the database
  context.on('error', async (ctx) => {
    if (!ctx.session.commited) {
      await constraints.release()
    }
  })

  return constraints
}
