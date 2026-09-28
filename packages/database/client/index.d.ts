
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model StudentProfile
 * 
 */
export type StudentProfile = $Result.DefaultSelection<Prisma.$StudentProfilePayload>
/**
 * Model Guardian
 * 
 */
export type Guardian = $Result.DefaultSelection<Prisma.$GuardianPayload>
/**
 * Model StudentGuardian
 * 
 */
export type StudentGuardian = $Result.DefaultSelection<Prisma.$StudentGuardianPayload>
/**
 * Model Discipline
 * 
 */
export type Discipline = $Result.DefaultSelection<Prisma.$DisciplinePayload>
/**
 * Model DisciplineProgram
 * 
 */
export type DisciplineProgram = $Result.DefaultSelection<Prisma.$DisciplineProgramPayload>
/**
 * Model BeltRank
 * 
 */
export type BeltRank = $Result.DefaultSelection<Prisma.$BeltRankPayload>
/**
 * Model StudentRank
 * 
 */
export type StudentRank = $Result.DefaultSelection<Prisma.$StudentRankPayload>
/**
 * Model Attendance
 * 
 */
export type Attendance = $Result.DefaultSelection<Prisma.$AttendancePayload>
/**
 * Model ProfileUpdateRequest
 * 
 */
export type ProfileUpdateRequest = $Result.DefaultSelection<Prisma.$ProfileUpdateRequestPayload>
/**
 * Model PromotionRequest
 * 
 */
export type PromotionRequest = $Result.DefaultSelection<Prisma.$PromotionRequestPayload>
/**
 * Model FeePlan
 * 
 */
export type FeePlan = $Result.DefaultSelection<Prisma.$FeePlanPayload>
/**
 * Model StudentSubscription
 * 
 */
export type StudentSubscription = $Result.DefaultSelection<Prisma.$StudentSubscriptionPayload>
/**
 * Model Federation
 * 
 */
export type Federation = $Result.DefaultSelection<Prisma.$FederationPayload>
/**
 * Model StudentLicense
 * 
 */
export type StudentLicense = $Result.DefaultSelection<Prisma.$StudentLicensePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN_STAFF: 'ADMIN_STAFF',
  SPORTS_TECHNICAL_DIRECTOR: 'SPORTS_TECHNICAL_DIRECTOR',
  INSTRUCTOR: 'INSTRUCTOR',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT'
};

export type Role = (typeof Role)[keyof typeof Role]


export const RequestStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type RequestStatus = $Enums.RequestStatus

export const RequestStatus: typeof $Enums.RequestStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.studentProfile`: Exposes CRUD operations for the **StudentProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentProfiles
    * const studentProfiles = await prisma.studentProfile.findMany()
    * ```
    */
  get studentProfile(): Prisma.StudentProfileDelegate<ExtArgs>;

  /**
   * `prisma.guardian`: Exposes CRUD operations for the **Guardian** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Guardians
    * const guardians = await prisma.guardian.findMany()
    * ```
    */
  get guardian(): Prisma.GuardianDelegate<ExtArgs>;

  /**
   * `prisma.studentGuardian`: Exposes CRUD operations for the **StudentGuardian** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentGuardians
    * const studentGuardians = await prisma.studentGuardian.findMany()
    * ```
    */
  get studentGuardian(): Prisma.StudentGuardianDelegate<ExtArgs>;

  /**
   * `prisma.discipline`: Exposes CRUD operations for the **Discipline** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Disciplines
    * const disciplines = await prisma.discipline.findMany()
    * ```
    */
  get discipline(): Prisma.DisciplineDelegate<ExtArgs>;

  /**
   * `prisma.disciplineProgram`: Exposes CRUD operations for the **DisciplineProgram** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DisciplinePrograms
    * const disciplinePrograms = await prisma.disciplineProgram.findMany()
    * ```
    */
  get disciplineProgram(): Prisma.DisciplineProgramDelegate<ExtArgs>;

  /**
   * `prisma.beltRank`: Exposes CRUD operations for the **BeltRank** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BeltRanks
    * const beltRanks = await prisma.beltRank.findMany()
    * ```
    */
  get beltRank(): Prisma.BeltRankDelegate<ExtArgs>;

  /**
   * `prisma.studentRank`: Exposes CRUD operations for the **StudentRank** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentRanks
    * const studentRanks = await prisma.studentRank.findMany()
    * ```
    */
  get studentRank(): Prisma.StudentRankDelegate<ExtArgs>;

  /**
   * `prisma.attendance`: Exposes CRUD operations for the **Attendance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Attendances
    * const attendances = await prisma.attendance.findMany()
    * ```
    */
  get attendance(): Prisma.AttendanceDelegate<ExtArgs>;

  /**
   * `prisma.profileUpdateRequest`: Exposes CRUD operations for the **ProfileUpdateRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfileUpdateRequests
    * const profileUpdateRequests = await prisma.profileUpdateRequest.findMany()
    * ```
    */
  get profileUpdateRequest(): Prisma.ProfileUpdateRequestDelegate<ExtArgs>;

  /**
   * `prisma.promotionRequest`: Exposes CRUD operations for the **PromotionRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PromotionRequests
    * const promotionRequests = await prisma.promotionRequest.findMany()
    * ```
    */
  get promotionRequest(): Prisma.PromotionRequestDelegate<ExtArgs>;

  /**
   * `prisma.feePlan`: Exposes CRUD operations for the **FeePlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FeePlans
    * const feePlans = await prisma.feePlan.findMany()
    * ```
    */
  get feePlan(): Prisma.FeePlanDelegate<ExtArgs>;

  /**
   * `prisma.studentSubscription`: Exposes CRUD operations for the **StudentSubscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentSubscriptions
    * const studentSubscriptions = await prisma.studentSubscription.findMany()
    * ```
    */
  get studentSubscription(): Prisma.StudentSubscriptionDelegate<ExtArgs>;

  /**
   * `prisma.federation`: Exposes CRUD operations for the **Federation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Federations
    * const federations = await prisma.federation.findMany()
    * ```
    */
  get federation(): Prisma.FederationDelegate<ExtArgs>;

  /**
   * `prisma.studentLicense`: Exposes CRUD operations for the **StudentLicense** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StudentLicenses
    * const studentLicenses = await prisma.studentLicense.findMany()
    * ```
    */
  get studentLicense(): Prisma.StudentLicenseDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    StudentProfile: 'StudentProfile',
    Guardian: 'Guardian',
    StudentGuardian: 'StudentGuardian',
    Discipline: 'Discipline',
    DisciplineProgram: 'DisciplineProgram',
    BeltRank: 'BeltRank',
    StudentRank: 'StudentRank',
    Attendance: 'Attendance',
    ProfileUpdateRequest: 'ProfileUpdateRequest',
    PromotionRequest: 'PromotionRequest',
    FeePlan: 'FeePlan',
    StudentSubscription: 'StudentSubscription',
    Federation: 'Federation',
    StudentLicense: 'StudentLicense'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "studentProfile" | "guardian" | "studentGuardian" | "discipline" | "disciplineProgram" | "beltRank" | "studentRank" | "attendance" | "profileUpdateRequest" | "promotionRequest" | "feePlan" | "studentSubscription" | "federation" | "studentLicense"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      StudentProfile: {
        payload: Prisma.$StudentProfilePayload<ExtArgs>
        fields: Prisma.StudentProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          findFirst: {
            args: Prisma.StudentProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          findMany: {
            args: Prisma.StudentProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>[]
          }
          create: {
            args: Prisma.StudentProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          createMany: {
            args: Prisma.StudentProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>[]
          }
          delete: {
            args: Prisma.StudentProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          update: {
            args: Prisma.StudentProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          deleteMany: {
            args: Prisma.StudentProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StudentProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentProfilePayload>
          }
          aggregate: {
            args: Prisma.StudentProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudentProfile>
          }
          groupBy: {
            args: Prisma.StudentProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentProfileCountArgs<ExtArgs>
            result: $Utils.Optional<StudentProfileCountAggregateOutputType> | number
          }
        }
      }
      Guardian: {
        payload: Prisma.$GuardianPayload<ExtArgs>
        fields: Prisma.GuardianFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuardianFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuardianFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          findFirst: {
            args: Prisma.GuardianFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuardianFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          findMany: {
            args: Prisma.GuardianFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>[]
          }
          create: {
            args: Prisma.GuardianCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          createMany: {
            args: Prisma.GuardianCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuardianCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>[]
          }
          delete: {
            args: Prisma.GuardianDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          update: {
            args: Prisma.GuardianUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          deleteMany: {
            args: Prisma.GuardianDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuardianUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GuardianUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          aggregate: {
            args: Prisma.GuardianAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuardian>
          }
          groupBy: {
            args: Prisma.GuardianGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuardianGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuardianCountArgs<ExtArgs>
            result: $Utils.Optional<GuardianCountAggregateOutputType> | number
          }
        }
      }
      StudentGuardian: {
        payload: Prisma.$StudentGuardianPayload<ExtArgs>
        fields: Prisma.StudentGuardianFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentGuardianFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentGuardianPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentGuardianFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentGuardianPayload>
          }
          findFirst: {
            args: Prisma.StudentGuardianFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentGuardianPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentGuardianFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentGuardianPayload>
          }
          findMany: {
            args: Prisma.StudentGuardianFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentGuardianPayload>[]
          }
          create: {
            args: Prisma.StudentGuardianCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentGuardianPayload>
          }
          createMany: {
            args: Prisma.StudentGuardianCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentGuardianCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentGuardianPayload>[]
          }
          delete: {
            args: Prisma.StudentGuardianDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentGuardianPayload>
          }
          update: {
            args: Prisma.StudentGuardianUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentGuardianPayload>
          }
          deleteMany: {
            args: Prisma.StudentGuardianDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentGuardianUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StudentGuardianUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentGuardianPayload>
          }
          aggregate: {
            args: Prisma.StudentGuardianAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudentGuardian>
          }
          groupBy: {
            args: Prisma.StudentGuardianGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentGuardianGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentGuardianCountArgs<ExtArgs>
            result: $Utils.Optional<StudentGuardianCountAggregateOutputType> | number
          }
        }
      }
      Discipline: {
        payload: Prisma.$DisciplinePayload<ExtArgs>
        fields: Prisma.DisciplineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DisciplineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DisciplineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinePayload>
          }
          findFirst: {
            args: Prisma.DisciplineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DisciplineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinePayload>
          }
          findMany: {
            args: Prisma.DisciplineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinePayload>[]
          }
          create: {
            args: Prisma.DisciplineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinePayload>
          }
          createMany: {
            args: Prisma.DisciplineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DisciplineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinePayload>[]
          }
          delete: {
            args: Prisma.DisciplineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinePayload>
          }
          update: {
            args: Prisma.DisciplineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinePayload>
          }
          deleteMany: {
            args: Prisma.DisciplineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DisciplineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DisciplineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplinePayload>
          }
          aggregate: {
            args: Prisma.DisciplineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiscipline>
          }
          groupBy: {
            args: Prisma.DisciplineGroupByArgs<ExtArgs>
            result: $Utils.Optional<DisciplineGroupByOutputType>[]
          }
          count: {
            args: Prisma.DisciplineCountArgs<ExtArgs>
            result: $Utils.Optional<DisciplineCountAggregateOutputType> | number
          }
        }
      }
      DisciplineProgram: {
        payload: Prisma.$DisciplineProgramPayload<ExtArgs>
        fields: Prisma.DisciplineProgramFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DisciplineProgramFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplineProgramPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DisciplineProgramFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplineProgramPayload>
          }
          findFirst: {
            args: Prisma.DisciplineProgramFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplineProgramPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DisciplineProgramFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplineProgramPayload>
          }
          findMany: {
            args: Prisma.DisciplineProgramFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplineProgramPayload>[]
          }
          create: {
            args: Prisma.DisciplineProgramCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplineProgramPayload>
          }
          createMany: {
            args: Prisma.DisciplineProgramCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DisciplineProgramCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplineProgramPayload>[]
          }
          delete: {
            args: Prisma.DisciplineProgramDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplineProgramPayload>
          }
          update: {
            args: Prisma.DisciplineProgramUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplineProgramPayload>
          }
          deleteMany: {
            args: Prisma.DisciplineProgramDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DisciplineProgramUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DisciplineProgramUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DisciplineProgramPayload>
          }
          aggregate: {
            args: Prisma.DisciplineProgramAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDisciplineProgram>
          }
          groupBy: {
            args: Prisma.DisciplineProgramGroupByArgs<ExtArgs>
            result: $Utils.Optional<DisciplineProgramGroupByOutputType>[]
          }
          count: {
            args: Prisma.DisciplineProgramCountArgs<ExtArgs>
            result: $Utils.Optional<DisciplineProgramCountAggregateOutputType> | number
          }
        }
      }
      BeltRank: {
        payload: Prisma.$BeltRankPayload<ExtArgs>
        fields: Prisma.BeltRankFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BeltRankFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeltRankPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BeltRankFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeltRankPayload>
          }
          findFirst: {
            args: Prisma.BeltRankFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeltRankPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BeltRankFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeltRankPayload>
          }
          findMany: {
            args: Prisma.BeltRankFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeltRankPayload>[]
          }
          create: {
            args: Prisma.BeltRankCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeltRankPayload>
          }
          createMany: {
            args: Prisma.BeltRankCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BeltRankCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeltRankPayload>[]
          }
          delete: {
            args: Prisma.BeltRankDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeltRankPayload>
          }
          update: {
            args: Prisma.BeltRankUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeltRankPayload>
          }
          deleteMany: {
            args: Prisma.BeltRankDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BeltRankUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BeltRankUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BeltRankPayload>
          }
          aggregate: {
            args: Prisma.BeltRankAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBeltRank>
          }
          groupBy: {
            args: Prisma.BeltRankGroupByArgs<ExtArgs>
            result: $Utils.Optional<BeltRankGroupByOutputType>[]
          }
          count: {
            args: Prisma.BeltRankCountArgs<ExtArgs>
            result: $Utils.Optional<BeltRankCountAggregateOutputType> | number
          }
        }
      }
      StudentRank: {
        payload: Prisma.$StudentRankPayload<ExtArgs>
        fields: Prisma.StudentRankFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentRankFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRankPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentRankFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRankPayload>
          }
          findFirst: {
            args: Prisma.StudentRankFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRankPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentRankFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRankPayload>
          }
          findMany: {
            args: Prisma.StudentRankFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRankPayload>[]
          }
          create: {
            args: Prisma.StudentRankCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRankPayload>
          }
          createMany: {
            args: Prisma.StudentRankCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentRankCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRankPayload>[]
          }
          delete: {
            args: Prisma.StudentRankDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRankPayload>
          }
          update: {
            args: Prisma.StudentRankUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRankPayload>
          }
          deleteMany: {
            args: Prisma.StudentRankDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentRankUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StudentRankUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentRankPayload>
          }
          aggregate: {
            args: Prisma.StudentRankAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudentRank>
          }
          groupBy: {
            args: Prisma.StudentRankGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentRankGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentRankCountArgs<ExtArgs>
            result: $Utils.Optional<StudentRankCountAggregateOutputType> | number
          }
        }
      }
      Attendance: {
        payload: Prisma.$AttendancePayload<ExtArgs>
        fields: Prisma.AttendanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AttendanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AttendanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          findFirst: {
            args: Prisma.AttendanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AttendanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          findMany: {
            args: Prisma.AttendanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>[]
          }
          create: {
            args: Prisma.AttendanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          createMany: {
            args: Prisma.AttendanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AttendanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>[]
          }
          delete: {
            args: Prisma.AttendanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          update: {
            args: Prisma.AttendanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          deleteMany: {
            args: Prisma.AttendanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AttendanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AttendanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttendancePayload>
          }
          aggregate: {
            args: Prisma.AttendanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAttendance>
          }
          groupBy: {
            args: Prisma.AttendanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<AttendanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.AttendanceCountArgs<ExtArgs>
            result: $Utils.Optional<AttendanceCountAggregateOutputType> | number
          }
        }
      }
      ProfileUpdateRequest: {
        payload: Prisma.$ProfileUpdateRequestPayload<ExtArgs>
        fields: Prisma.ProfileUpdateRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileUpdateRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileUpdateRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileUpdateRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileUpdateRequestPayload>
          }
          findFirst: {
            args: Prisma.ProfileUpdateRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileUpdateRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileUpdateRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileUpdateRequestPayload>
          }
          findMany: {
            args: Prisma.ProfileUpdateRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileUpdateRequestPayload>[]
          }
          create: {
            args: Prisma.ProfileUpdateRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileUpdateRequestPayload>
          }
          createMany: {
            args: Prisma.ProfileUpdateRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileUpdateRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileUpdateRequestPayload>[]
          }
          delete: {
            args: Prisma.ProfileUpdateRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileUpdateRequestPayload>
          }
          update: {
            args: Prisma.ProfileUpdateRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileUpdateRequestPayload>
          }
          deleteMany: {
            args: Prisma.ProfileUpdateRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProfileUpdateRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfileUpdateRequestPayload>
          }
          aggregate: {
            args: Prisma.ProfileUpdateRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfileUpdateRequest>
          }
          groupBy: {
            args: Prisma.ProfileUpdateRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileUpdateRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileUpdateRequestCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileUpdateRequestCountAggregateOutputType> | number
          }
        }
      }
      PromotionRequest: {
        payload: Prisma.$PromotionRequestPayload<ExtArgs>
        fields: Prisma.PromotionRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PromotionRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PromotionRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionRequestPayload>
          }
          findFirst: {
            args: Prisma.PromotionRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PromotionRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionRequestPayload>
          }
          findMany: {
            args: Prisma.PromotionRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionRequestPayload>[]
          }
          create: {
            args: Prisma.PromotionRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionRequestPayload>
          }
          createMany: {
            args: Prisma.PromotionRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PromotionRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionRequestPayload>[]
          }
          delete: {
            args: Prisma.PromotionRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionRequestPayload>
          }
          update: {
            args: Prisma.PromotionRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionRequestPayload>
          }
          deleteMany: {
            args: Prisma.PromotionRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PromotionRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PromotionRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromotionRequestPayload>
          }
          aggregate: {
            args: Prisma.PromotionRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePromotionRequest>
          }
          groupBy: {
            args: Prisma.PromotionRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<PromotionRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.PromotionRequestCountArgs<ExtArgs>
            result: $Utils.Optional<PromotionRequestCountAggregateOutputType> | number
          }
        }
      }
      FeePlan: {
        payload: Prisma.$FeePlanPayload<ExtArgs>
        fields: Prisma.FeePlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FeePlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeePlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FeePlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeePlanPayload>
          }
          findFirst: {
            args: Prisma.FeePlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeePlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FeePlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeePlanPayload>
          }
          findMany: {
            args: Prisma.FeePlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeePlanPayload>[]
          }
          create: {
            args: Prisma.FeePlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeePlanPayload>
          }
          createMany: {
            args: Prisma.FeePlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FeePlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeePlanPayload>[]
          }
          delete: {
            args: Prisma.FeePlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeePlanPayload>
          }
          update: {
            args: Prisma.FeePlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeePlanPayload>
          }
          deleteMany: {
            args: Prisma.FeePlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FeePlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FeePlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeePlanPayload>
          }
          aggregate: {
            args: Prisma.FeePlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeePlan>
          }
          groupBy: {
            args: Prisma.FeePlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeePlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.FeePlanCountArgs<ExtArgs>
            result: $Utils.Optional<FeePlanCountAggregateOutputType> | number
          }
        }
      }
      StudentSubscription: {
        payload: Prisma.$StudentSubscriptionPayload<ExtArgs>
        fields: Prisma.StudentSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentSubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentSubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.StudentSubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentSubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubscriptionPayload>
          }
          findMany: {
            args: Prisma.StudentSubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubscriptionPayload>[]
          }
          create: {
            args: Prisma.StudentSubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubscriptionPayload>
          }
          createMany: {
            args: Prisma.StudentSubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentSubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubscriptionPayload>[]
          }
          delete: {
            args: Prisma.StudentSubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubscriptionPayload>
          }
          update: {
            args: Prisma.StudentSubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.StudentSubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentSubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StudentSubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.StudentSubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudentSubscription>
          }
          groupBy: {
            args: Prisma.StudentSubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentSubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentSubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<StudentSubscriptionCountAggregateOutputType> | number
          }
        }
      }
      Federation: {
        payload: Prisma.$FederationPayload<ExtArgs>
        fields: Prisma.FederationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FederationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FederationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FederationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FederationPayload>
          }
          findFirst: {
            args: Prisma.FederationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FederationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FederationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FederationPayload>
          }
          findMany: {
            args: Prisma.FederationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FederationPayload>[]
          }
          create: {
            args: Prisma.FederationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FederationPayload>
          }
          createMany: {
            args: Prisma.FederationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FederationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FederationPayload>[]
          }
          delete: {
            args: Prisma.FederationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FederationPayload>
          }
          update: {
            args: Prisma.FederationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FederationPayload>
          }
          deleteMany: {
            args: Prisma.FederationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FederationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FederationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FederationPayload>
          }
          aggregate: {
            args: Prisma.FederationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFederation>
          }
          groupBy: {
            args: Prisma.FederationGroupByArgs<ExtArgs>
            result: $Utils.Optional<FederationGroupByOutputType>[]
          }
          count: {
            args: Prisma.FederationCountArgs<ExtArgs>
            result: $Utils.Optional<FederationCountAggregateOutputType> | number
          }
        }
      }
      StudentLicense: {
        payload: Prisma.$StudentLicensePayload<ExtArgs>
        fields: Prisma.StudentLicenseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentLicenseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentLicensePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentLicenseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentLicensePayload>
          }
          findFirst: {
            args: Prisma.StudentLicenseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentLicensePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentLicenseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentLicensePayload>
          }
          findMany: {
            args: Prisma.StudentLicenseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentLicensePayload>[]
          }
          create: {
            args: Prisma.StudentLicenseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentLicensePayload>
          }
          createMany: {
            args: Prisma.StudentLicenseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentLicenseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentLicensePayload>[]
          }
          delete: {
            args: Prisma.StudentLicenseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentLicensePayload>
          }
          update: {
            args: Prisma.StudentLicenseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentLicensePayload>
          }
          deleteMany: {
            args: Prisma.StudentLicenseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentLicenseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StudentLicenseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentLicensePayload>
          }
          aggregate: {
            args: Prisma.StudentLicenseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudentLicense>
          }
          groupBy: {
            args: Prisma.StudentLicenseGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentLicenseGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentLicenseCountArgs<ExtArgs>
            result: $Utils.Optional<StudentLicenseCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    reviewedUpdates: number
    proposedPromotions: number
    approvedPromotions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviewedUpdates?: boolean | UserCountOutputTypeCountReviewedUpdatesArgs
    proposedPromotions?: boolean | UserCountOutputTypeCountProposedPromotionsArgs
    approvedPromotions?: boolean | UserCountOutputTypeCountApprovedPromotionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReviewedUpdatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileUpdateRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProposedPromotionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromotionRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountApprovedPromotionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromotionRequestWhereInput
  }


  /**
   * Count Type StudentProfileCountOutputType
   */

  export type StudentProfileCountOutputType = {
    guardians: number
    ranks: number
    attendances: number
    updateRequests: number
    promotionRequests: number
    subscriptions: number
    licenses: number
  }

  export type StudentProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    guardians?: boolean | StudentProfileCountOutputTypeCountGuardiansArgs
    ranks?: boolean | StudentProfileCountOutputTypeCountRanksArgs
    attendances?: boolean | StudentProfileCountOutputTypeCountAttendancesArgs
    updateRequests?: boolean | StudentProfileCountOutputTypeCountUpdateRequestsArgs
    promotionRequests?: boolean | StudentProfileCountOutputTypeCountPromotionRequestsArgs
    subscriptions?: boolean | StudentProfileCountOutputTypeCountSubscriptionsArgs
    licenses?: boolean | StudentProfileCountOutputTypeCountLicensesArgs
  }

  // Custom InputTypes
  /**
   * StudentProfileCountOutputType without action
   */
  export type StudentProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfileCountOutputType
     */
    select?: StudentProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StudentProfileCountOutputType without action
   */
  export type StudentProfileCountOutputTypeCountGuardiansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentGuardianWhereInput
  }

  /**
   * StudentProfileCountOutputType without action
   */
  export type StudentProfileCountOutputTypeCountRanksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentRankWhereInput
  }

  /**
   * StudentProfileCountOutputType without action
   */
  export type StudentProfileCountOutputTypeCountAttendancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttendanceWhereInput
  }

  /**
   * StudentProfileCountOutputType without action
   */
  export type StudentProfileCountOutputTypeCountUpdateRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileUpdateRequestWhereInput
  }

  /**
   * StudentProfileCountOutputType without action
   */
  export type StudentProfileCountOutputTypeCountPromotionRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromotionRequestWhereInput
  }

  /**
   * StudentProfileCountOutputType without action
   */
  export type StudentProfileCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentSubscriptionWhereInput
  }

  /**
   * StudentProfileCountOutputType without action
   */
  export type StudentProfileCountOutputTypeCountLicensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentLicenseWhereInput
  }


  /**
   * Count Type GuardianCountOutputType
   */

  export type GuardianCountOutputType = {
    students: number
  }

  export type GuardianCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    students?: boolean | GuardianCountOutputTypeCountStudentsArgs
  }

  // Custom InputTypes
  /**
   * GuardianCountOutputType without action
   */
  export type GuardianCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GuardianCountOutputType
     */
    select?: GuardianCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GuardianCountOutputType without action
   */
  export type GuardianCountOutputTypeCountStudentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentGuardianWhereInput
  }


  /**
   * Count Type DisciplineCountOutputType
   */

  export type DisciplineCountOutputType = {
    programs: number
  }

  export type DisciplineCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programs?: boolean | DisciplineCountOutputTypeCountProgramsArgs
  }

  // Custom InputTypes
  /**
   * DisciplineCountOutputType without action
   */
  export type DisciplineCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineCountOutputType
     */
    select?: DisciplineCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DisciplineCountOutputType without action
   */
  export type DisciplineCountOutputTypeCountProgramsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DisciplineProgramWhereInput
  }


  /**
   * Count Type DisciplineProgramCountOutputType
   */

  export type DisciplineProgramCountOutputType = {
    beltRanks: number
  }

  export type DisciplineProgramCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    beltRanks?: boolean | DisciplineProgramCountOutputTypeCountBeltRanksArgs
  }

  // Custom InputTypes
  /**
   * DisciplineProgramCountOutputType without action
   */
  export type DisciplineProgramCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgramCountOutputType
     */
    select?: DisciplineProgramCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DisciplineProgramCountOutputType without action
   */
  export type DisciplineProgramCountOutputTypeCountBeltRanksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BeltRankWhereInput
  }


  /**
   * Count Type BeltRankCountOutputType
   */

  export type BeltRankCountOutputType = {
    studentRanks: number
  }

  export type BeltRankCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studentRanks?: boolean | BeltRankCountOutputTypeCountStudentRanksArgs
  }

  // Custom InputTypes
  /**
   * BeltRankCountOutputType without action
   */
  export type BeltRankCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRankCountOutputType
     */
    select?: BeltRankCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BeltRankCountOutputType without action
   */
  export type BeltRankCountOutputTypeCountStudentRanksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentRankWhereInput
  }


  /**
   * Count Type FeePlanCountOutputType
   */

  export type FeePlanCountOutputType = {
    subscriptions: number
  }

  export type FeePlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | FeePlanCountOutputTypeCountSubscriptionsArgs
  }

  // Custom InputTypes
  /**
   * FeePlanCountOutputType without action
   */
  export type FeePlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlanCountOutputType
     */
    select?: FeePlanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FeePlanCountOutputType without action
   */
  export type FeePlanCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentSubscriptionWhereInput
  }


  /**
   * Count Type FederationCountOutputType
   */

  export type FederationCountOutputType = {
    licenses: number
  }

  export type FederationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    licenses?: boolean | FederationCountOutputTypeCountLicensesArgs
  }

  // Custom InputTypes
  /**
   * FederationCountOutputType without action
   */
  export type FederationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FederationCountOutputType
     */
    select?: FederationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FederationCountOutputType without action
   */
  export type FederationCountOutputTypeCountLicensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentLicenseWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    firstName: number
    lastName: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role: $Enums.Role
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    studentProfile?: boolean | User$studentProfileArgs<ExtArgs>
    guardianProfile?: boolean | User$guardianProfileArgs<ExtArgs>
    reviewedUpdates?: boolean | User$reviewedUpdatesArgs<ExtArgs>
    proposedPromotions?: boolean | User$proposedPromotionsArgs<ExtArgs>
    approvedPromotions?: boolean | User$approvedPromotionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studentProfile?: boolean | User$studentProfileArgs<ExtArgs>
    guardianProfile?: boolean | User$guardianProfileArgs<ExtArgs>
    reviewedUpdates?: boolean | User$reviewedUpdatesArgs<ExtArgs>
    proposedPromotions?: boolean | User$proposedPromotionsArgs<ExtArgs>
    approvedPromotions?: boolean | User$approvedPromotionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      studentProfile: Prisma.$StudentProfilePayload<ExtArgs> | null
      guardianProfile: Prisma.$GuardianPayload<ExtArgs> | null
      reviewedUpdates: Prisma.$ProfileUpdateRequestPayload<ExtArgs>[]
      proposedPromotions: Prisma.$PromotionRequestPayload<ExtArgs>[]
      approvedPromotions: Prisma.$PromotionRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      firstName: string
      lastName: string
      role: $Enums.Role
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    studentProfile<T extends User$studentProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$studentProfileArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    guardianProfile<T extends User$guardianProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$guardianProfileArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    reviewedUpdates<T extends User$reviewedUpdatesArgs<ExtArgs> = {}>(args?: Subset<T, User$reviewedUpdatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "findMany"> | Null>
    proposedPromotions<T extends User$proposedPromotionsArgs<ExtArgs> = {}>(args?: Subset<T, User$proposedPromotionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findMany"> | Null>
    approvedPromotions<T extends User$approvedPromotionsArgs<ExtArgs> = {}>(args?: Subset<T, User$approvedPromotionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.studentProfile
   */
  export type User$studentProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    where?: StudentProfileWhereInput
  }

  /**
   * User.guardianProfile
   */
  export type User$guardianProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    where?: GuardianWhereInput
  }

  /**
   * User.reviewedUpdates
   */
  export type User$reviewedUpdatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
    where?: ProfileUpdateRequestWhereInput
    orderBy?: ProfileUpdateRequestOrderByWithRelationInput | ProfileUpdateRequestOrderByWithRelationInput[]
    cursor?: ProfileUpdateRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfileUpdateRequestScalarFieldEnum | ProfileUpdateRequestScalarFieldEnum[]
  }

  /**
   * User.proposedPromotions
   */
  export type User$proposedPromotionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    where?: PromotionRequestWhereInput
    orderBy?: PromotionRequestOrderByWithRelationInput | PromotionRequestOrderByWithRelationInput[]
    cursor?: PromotionRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PromotionRequestScalarFieldEnum | PromotionRequestScalarFieldEnum[]
  }

  /**
   * User.approvedPromotions
   */
  export type User$approvedPromotionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    where?: PromotionRequestWhereInput
    orderBy?: PromotionRequestOrderByWithRelationInput | PromotionRequestOrderByWithRelationInput[]
    cursor?: PromotionRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PromotionRequestScalarFieldEnum | PromotionRequestScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model StudentProfile
   */

  export type AggregateStudentProfile = {
    _count: StudentProfileCountAggregateOutputType | null
    _min: StudentProfileMinAggregateOutputType | null
    _max: StudentProfileMaxAggregateOutputType | null
  }

  export type StudentProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    birthDate: Date | null
    phone: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    birthDate: Date | null
    phone: string | null
    address: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentProfileCountAggregateOutputType = {
    id: number
    userId: number
    birthDate: number
    phone: number
    address: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StudentProfileMinAggregateInputType = {
    id?: true
    userId?: true
    birthDate?: true
    phone?: true
    address?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    birthDate?: true
    phone?: true
    address?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentProfileCountAggregateInputType = {
    id?: true
    userId?: true
    birthDate?: true
    phone?: true
    address?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StudentProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentProfile to aggregate.
     */
    where?: StudentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProfiles to fetch.
     */
    orderBy?: StudentProfileOrderByWithRelationInput | StudentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudentProfiles
    **/
    _count?: true | StudentProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentProfileMaxAggregateInputType
  }

  export type GetStudentProfileAggregateType<T extends StudentProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateStudentProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudentProfile[P]>
      : GetScalarType<T[P], AggregateStudentProfile[P]>
  }




  export type StudentProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentProfileWhereInput
    orderBy?: StudentProfileOrderByWithAggregationInput | StudentProfileOrderByWithAggregationInput[]
    by: StudentProfileScalarFieldEnum[] | StudentProfileScalarFieldEnum
    having?: StudentProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentProfileCountAggregateInputType | true
    _min?: StudentProfileMinAggregateInputType
    _max?: StudentProfileMaxAggregateInputType
  }

  export type StudentProfileGroupByOutputType = {
    id: string
    userId: string
    birthDate: Date | null
    phone: string | null
    address: string | null
    createdAt: Date
    updatedAt: Date
    _count: StudentProfileCountAggregateOutputType | null
    _min: StudentProfileMinAggregateOutputType | null
    _max: StudentProfileMaxAggregateOutputType | null
  }

  type GetStudentProfileGroupByPayload<T extends StudentProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentProfileGroupByOutputType[P]>
            : GetScalarType<T[P], StudentProfileGroupByOutputType[P]>
        }
      >
    >


  export type StudentProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    birthDate?: boolean
    phone?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    guardians?: boolean | StudentProfile$guardiansArgs<ExtArgs>
    ranks?: boolean | StudentProfile$ranksArgs<ExtArgs>
    attendances?: boolean | StudentProfile$attendancesArgs<ExtArgs>
    updateRequests?: boolean | StudentProfile$updateRequestsArgs<ExtArgs>
    promotionRequests?: boolean | StudentProfile$promotionRequestsArgs<ExtArgs>
    subscriptions?: boolean | StudentProfile$subscriptionsArgs<ExtArgs>
    licenses?: boolean | StudentProfile$licensesArgs<ExtArgs>
    _count?: boolean | StudentProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentProfile"]>

  export type StudentProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    birthDate?: boolean
    phone?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentProfile"]>

  export type StudentProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    birthDate?: boolean
    phone?: boolean
    address?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StudentProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    guardians?: boolean | StudentProfile$guardiansArgs<ExtArgs>
    ranks?: boolean | StudentProfile$ranksArgs<ExtArgs>
    attendances?: boolean | StudentProfile$attendancesArgs<ExtArgs>
    updateRequests?: boolean | StudentProfile$updateRequestsArgs<ExtArgs>
    promotionRequests?: boolean | StudentProfile$promotionRequestsArgs<ExtArgs>
    subscriptions?: boolean | StudentProfile$subscriptionsArgs<ExtArgs>
    licenses?: boolean | StudentProfile$licensesArgs<ExtArgs>
    _count?: boolean | StudentProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StudentProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $StudentProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      guardians: Prisma.$StudentGuardianPayload<ExtArgs>[]
      ranks: Prisma.$StudentRankPayload<ExtArgs>[]
      attendances: Prisma.$AttendancePayload<ExtArgs>[]
      updateRequests: Prisma.$ProfileUpdateRequestPayload<ExtArgs>[]
      promotionRequests: Prisma.$PromotionRequestPayload<ExtArgs>[]
      subscriptions: Prisma.$StudentSubscriptionPayload<ExtArgs>[]
      licenses: Prisma.$StudentLicensePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      birthDate: Date | null
      phone: string | null
      address: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["studentProfile"]>
    composites: {}
  }

  type StudentProfileGetPayload<S extends boolean | null | undefined | StudentProfileDefaultArgs> = $Result.GetResult<Prisma.$StudentProfilePayload, S>

  type StudentProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StudentProfileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StudentProfileCountAggregateInputType | true
    }

  export interface StudentProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudentProfile'], meta: { name: 'StudentProfile' } }
    /**
     * Find zero or one StudentProfile that matches the filter.
     * @param {StudentProfileFindUniqueArgs} args - Arguments to find a StudentProfile
     * @example
     * // Get one StudentProfile
     * const studentProfile = await prisma.studentProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentProfileFindUniqueArgs>(args: SelectSubset<T, StudentProfileFindUniqueArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StudentProfile that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StudentProfileFindUniqueOrThrowArgs} args - Arguments to find a StudentProfile
     * @example
     * // Get one StudentProfile
     * const studentProfile = await prisma.studentProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StudentProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileFindFirstArgs} args - Arguments to find a StudentProfile
     * @example
     * // Get one StudentProfile
     * const studentProfile = await prisma.studentProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentProfileFindFirstArgs>(args?: SelectSubset<T, StudentProfileFindFirstArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StudentProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileFindFirstOrThrowArgs} args - Arguments to find a StudentProfile
     * @example
     * // Get one StudentProfile
     * const studentProfile = await prisma.studentProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StudentProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudentProfiles
     * const studentProfiles = await prisma.studentProfile.findMany()
     * 
     * // Get first 10 StudentProfiles
     * const studentProfiles = await prisma.studentProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentProfileWithIdOnly = await prisma.studentProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentProfileFindManyArgs>(args?: SelectSubset<T, StudentProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StudentProfile.
     * @param {StudentProfileCreateArgs} args - Arguments to create a StudentProfile.
     * @example
     * // Create one StudentProfile
     * const StudentProfile = await prisma.studentProfile.create({
     *   data: {
     *     // ... data to create a StudentProfile
     *   }
     * })
     * 
     */
    create<T extends StudentProfileCreateArgs>(args: SelectSubset<T, StudentProfileCreateArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StudentProfiles.
     * @param {StudentProfileCreateManyArgs} args - Arguments to create many StudentProfiles.
     * @example
     * // Create many StudentProfiles
     * const studentProfile = await prisma.studentProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentProfileCreateManyArgs>(args?: SelectSubset<T, StudentProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudentProfiles and returns the data saved in the database.
     * @param {StudentProfileCreateManyAndReturnArgs} args - Arguments to create many StudentProfiles.
     * @example
     * // Create many StudentProfiles
     * const studentProfile = await prisma.studentProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudentProfiles and only return the `id`
     * const studentProfileWithIdOnly = await prisma.studentProfile.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StudentProfile.
     * @param {StudentProfileDeleteArgs} args - Arguments to delete one StudentProfile.
     * @example
     * // Delete one StudentProfile
     * const StudentProfile = await prisma.studentProfile.delete({
     *   where: {
     *     // ... filter to delete one StudentProfile
     *   }
     * })
     * 
     */
    delete<T extends StudentProfileDeleteArgs>(args: SelectSubset<T, StudentProfileDeleteArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StudentProfile.
     * @param {StudentProfileUpdateArgs} args - Arguments to update one StudentProfile.
     * @example
     * // Update one StudentProfile
     * const studentProfile = await prisma.studentProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentProfileUpdateArgs>(args: SelectSubset<T, StudentProfileUpdateArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StudentProfiles.
     * @param {StudentProfileDeleteManyArgs} args - Arguments to filter StudentProfiles to delete.
     * @example
     * // Delete a few StudentProfiles
     * const { count } = await prisma.studentProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentProfileDeleteManyArgs>(args?: SelectSubset<T, StudentProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudentProfiles
     * const studentProfile = await prisma.studentProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentProfileUpdateManyArgs>(args: SelectSubset<T, StudentProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StudentProfile.
     * @param {StudentProfileUpsertArgs} args - Arguments to update or create a StudentProfile.
     * @example
     * // Update or create a StudentProfile
     * const studentProfile = await prisma.studentProfile.upsert({
     *   create: {
     *     // ... data to create a StudentProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudentProfile we want to update
     *   }
     * })
     */
    upsert<T extends StudentProfileUpsertArgs>(args: SelectSubset<T, StudentProfileUpsertArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StudentProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileCountArgs} args - Arguments to filter StudentProfiles to count.
     * @example
     * // Count the number of StudentProfiles
     * const count = await prisma.studentProfile.count({
     *   where: {
     *     // ... the filter for the StudentProfiles we want to count
     *   }
     * })
    **/
    count<T extends StudentProfileCountArgs>(
      args?: Subset<T, StudentProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudentProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentProfileAggregateArgs>(args: Subset<T, StudentProfileAggregateArgs>): Prisma.PrismaPromise<GetStudentProfileAggregateType<T>>

    /**
     * Group by StudentProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentProfileGroupByArgs['orderBy'] }
        : { orderBy?: StudentProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudentProfile model
   */
  readonly fields: StudentProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudentProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    guardians<T extends StudentProfile$guardiansArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfile$guardiansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "findMany"> | Null>
    ranks<T extends StudentProfile$ranksArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfile$ranksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "findMany"> | Null>
    attendances<T extends StudentProfile$attendancesArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfile$attendancesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findMany"> | Null>
    updateRequests<T extends StudentProfile$updateRequestsArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfile$updateRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "findMany"> | Null>
    promotionRequests<T extends StudentProfile$promotionRequestsArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfile$promotionRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findMany"> | Null>
    subscriptions<T extends StudentProfile$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfile$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "findMany"> | Null>
    licenses<T extends StudentProfile$licensesArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfile$licensesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StudentProfile model
   */ 
  interface StudentProfileFieldRefs {
    readonly id: FieldRef<"StudentProfile", 'String'>
    readonly userId: FieldRef<"StudentProfile", 'String'>
    readonly birthDate: FieldRef<"StudentProfile", 'DateTime'>
    readonly phone: FieldRef<"StudentProfile", 'String'>
    readonly address: FieldRef<"StudentProfile", 'String'>
    readonly createdAt: FieldRef<"StudentProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"StudentProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StudentProfile findUnique
   */
  export type StudentProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter, which StudentProfile to fetch.
     */
    where: StudentProfileWhereUniqueInput
  }

  /**
   * StudentProfile findUniqueOrThrow
   */
  export type StudentProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter, which StudentProfile to fetch.
     */
    where: StudentProfileWhereUniqueInput
  }

  /**
   * StudentProfile findFirst
   */
  export type StudentProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter, which StudentProfile to fetch.
     */
    where?: StudentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProfiles to fetch.
     */
    orderBy?: StudentProfileOrderByWithRelationInput | StudentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentProfiles.
     */
    cursor?: StudentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentProfiles.
     */
    distinct?: StudentProfileScalarFieldEnum | StudentProfileScalarFieldEnum[]
  }

  /**
   * StudentProfile findFirstOrThrow
   */
  export type StudentProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter, which StudentProfile to fetch.
     */
    where?: StudentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProfiles to fetch.
     */
    orderBy?: StudentProfileOrderByWithRelationInput | StudentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentProfiles.
     */
    cursor?: StudentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentProfiles.
     */
    distinct?: StudentProfileScalarFieldEnum | StudentProfileScalarFieldEnum[]
  }

  /**
   * StudentProfile findMany
   */
  export type StudentProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter, which StudentProfiles to fetch.
     */
    where?: StudentProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentProfiles to fetch.
     */
    orderBy?: StudentProfileOrderByWithRelationInput | StudentProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudentProfiles.
     */
    cursor?: StudentProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentProfiles.
     */
    skip?: number
    distinct?: StudentProfileScalarFieldEnum | StudentProfileScalarFieldEnum[]
  }

  /**
   * StudentProfile create
   */
  export type StudentProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a StudentProfile.
     */
    data: XOR<StudentProfileCreateInput, StudentProfileUncheckedCreateInput>
  }

  /**
   * StudentProfile createMany
   */
  export type StudentProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudentProfiles.
     */
    data: StudentProfileCreateManyInput | StudentProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StudentProfile createManyAndReturn
   */
  export type StudentProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StudentProfiles.
     */
    data: StudentProfileCreateManyInput | StudentProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentProfile update
   */
  export type StudentProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a StudentProfile.
     */
    data: XOR<StudentProfileUpdateInput, StudentProfileUncheckedUpdateInput>
    /**
     * Choose, which StudentProfile to update.
     */
    where: StudentProfileWhereUniqueInput
  }

  /**
   * StudentProfile updateMany
   */
  export type StudentProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudentProfiles.
     */
    data: XOR<StudentProfileUpdateManyMutationInput, StudentProfileUncheckedUpdateManyInput>
    /**
     * Filter which StudentProfiles to update
     */
    where?: StudentProfileWhereInput
  }

  /**
   * StudentProfile upsert
   */
  export type StudentProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the StudentProfile to update in case it exists.
     */
    where: StudentProfileWhereUniqueInput
    /**
     * In case the StudentProfile found by the `where` argument doesn't exist, create a new StudentProfile with this data.
     */
    create: XOR<StudentProfileCreateInput, StudentProfileUncheckedCreateInput>
    /**
     * In case the StudentProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentProfileUpdateInput, StudentProfileUncheckedUpdateInput>
  }

  /**
   * StudentProfile delete
   */
  export type StudentProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
    /**
     * Filter which StudentProfile to delete.
     */
    where: StudentProfileWhereUniqueInput
  }

  /**
   * StudentProfile deleteMany
   */
  export type StudentProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentProfiles to delete
     */
    where?: StudentProfileWhereInput
  }

  /**
   * StudentProfile.guardians
   */
  export type StudentProfile$guardiansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
    where?: StudentGuardianWhereInput
    orderBy?: StudentGuardianOrderByWithRelationInput | StudentGuardianOrderByWithRelationInput[]
    cursor?: StudentGuardianWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentGuardianScalarFieldEnum | StudentGuardianScalarFieldEnum[]
  }

  /**
   * StudentProfile.ranks
   */
  export type StudentProfile$ranksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
    where?: StudentRankWhereInput
    orderBy?: StudentRankOrderByWithRelationInput | StudentRankOrderByWithRelationInput[]
    cursor?: StudentRankWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentRankScalarFieldEnum | StudentRankScalarFieldEnum[]
  }

  /**
   * StudentProfile.attendances
   */
  export type StudentProfile$attendancesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    where?: AttendanceWhereInput
    orderBy?: AttendanceOrderByWithRelationInput | AttendanceOrderByWithRelationInput[]
    cursor?: AttendanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AttendanceScalarFieldEnum | AttendanceScalarFieldEnum[]
  }

  /**
   * StudentProfile.updateRequests
   */
  export type StudentProfile$updateRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
    where?: ProfileUpdateRequestWhereInput
    orderBy?: ProfileUpdateRequestOrderByWithRelationInput | ProfileUpdateRequestOrderByWithRelationInput[]
    cursor?: ProfileUpdateRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfileUpdateRequestScalarFieldEnum | ProfileUpdateRequestScalarFieldEnum[]
  }

  /**
   * StudentProfile.promotionRequests
   */
  export type StudentProfile$promotionRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    where?: PromotionRequestWhereInput
    orderBy?: PromotionRequestOrderByWithRelationInput | PromotionRequestOrderByWithRelationInput[]
    cursor?: PromotionRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PromotionRequestScalarFieldEnum | PromotionRequestScalarFieldEnum[]
  }

  /**
   * StudentProfile.subscriptions
   */
  export type StudentProfile$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
    where?: StudentSubscriptionWhereInput
    orderBy?: StudentSubscriptionOrderByWithRelationInput | StudentSubscriptionOrderByWithRelationInput[]
    cursor?: StudentSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentSubscriptionScalarFieldEnum | StudentSubscriptionScalarFieldEnum[]
  }

  /**
   * StudentProfile.licenses
   */
  export type StudentProfile$licensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
    where?: StudentLicenseWhereInput
    orderBy?: StudentLicenseOrderByWithRelationInput | StudentLicenseOrderByWithRelationInput[]
    cursor?: StudentLicenseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentLicenseScalarFieldEnum | StudentLicenseScalarFieldEnum[]
  }

  /**
   * StudentProfile without action
   */
  export type StudentProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentProfile
     */
    select?: StudentProfileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentProfileInclude<ExtArgs> | null
  }


  /**
   * Model Guardian
   */

  export type AggregateGuardian = {
    _count: GuardianCountAggregateOutputType | null
    _min: GuardianMinAggregateOutputType | null
    _max: GuardianMaxAggregateOutputType | null
  }

  export type GuardianMinAggregateOutputType = {
    id: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type GuardianMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    createdAt: Date | null
  }

  export type GuardianCountAggregateOutputType = {
    id: number
    userId: number
    createdAt: number
    _all: number
  }


  export type GuardianMinAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
  }

  export type GuardianMaxAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
  }

  export type GuardianCountAggregateInputType = {
    id?: true
    userId?: true
    createdAt?: true
    _all?: true
  }

  export type GuardianAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guardian to aggregate.
     */
    where?: GuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guardians to fetch.
     */
    orderBy?: GuardianOrderByWithRelationInput | GuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guardians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Guardians
    **/
    _count?: true | GuardianCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuardianMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuardianMaxAggregateInputType
  }

  export type GetGuardianAggregateType<T extends GuardianAggregateArgs> = {
        [P in keyof T & keyof AggregateGuardian]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuardian[P]>
      : GetScalarType<T[P], AggregateGuardian[P]>
  }




  export type GuardianGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuardianWhereInput
    orderBy?: GuardianOrderByWithAggregationInput | GuardianOrderByWithAggregationInput[]
    by: GuardianScalarFieldEnum[] | GuardianScalarFieldEnum
    having?: GuardianScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuardianCountAggregateInputType | true
    _min?: GuardianMinAggregateInputType
    _max?: GuardianMaxAggregateInputType
  }

  export type GuardianGroupByOutputType = {
    id: string
    userId: string
    createdAt: Date
    _count: GuardianCountAggregateOutputType | null
    _min: GuardianMinAggregateOutputType | null
    _max: GuardianMaxAggregateOutputType | null
  }

  type GetGuardianGroupByPayload<T extends GuardianGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuardianGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuardianGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuardianGroupByOutputType[P]>
            : GetScalarType<T[P], GuardianGroupByOutputType[P]>
        }
      >
    >


  export type GuardianSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    students?: boolean | Guardian$studentsArgs<ExtArgs>
    _count?: boolean | GuardianCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guardian"]>

  export type GuardianSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guardian"]>

  export type GuardianSelectScalar = {
    id?: boolean
    userId?: boolean
    createdAt?: boolean
  }

  export type GuardianInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    students?: boolean | Guardian$studentsArgs<ExtArgs>
    _count?: boolean | GuardianCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GuardianIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $GuardianPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Guardian"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      students: Prisma.$StudentGuardianPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      createdAt: Date
    }, ExtArgs["result"]["guardian"]>
    composites: {}
  }

  type GuardianGetPayload<S extends boolean | null | undefined | GuardianDefaultArgs> = $Result.GetResult<Prisma.$GuardianPayload, S>

  type GuardianCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GuardianFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GuardianCountAggregateInputType | true
    }

  export interface GuardianDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Guardian'], meta: { name: 'Guardian' } }
    /**
     * Find zero or one Guardian that matches the filter.
     * @param {GuardianFindUniqueArgs} args - Arguments to find a Guardian
     * @example
     * // Get one Guardian
     * const guardian = await prisma.guardian.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuardianFindUniqueArgs>(args: SelectSubset<T, GuardianFindUniqueArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Guardian that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GuardianFindUniqueOrThrowArgs} args - Arguments to find a Guardian
     * @example
     * // Get one Guardian
     * const guardian = await prisma.guardian.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuardianFindUniqueOrThrowArgs>(args: SelectSubset<T, GuardianFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Guardian that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianFindFirstArgs} args - Arguments to find a Guardian
     * @example
     * // Get one Guardian
     * const guardian = await prisma.guardian.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuardianFindFirstArgs>(args?: SelectSubset<T, GuardianFindFirstArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Guardian that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianFindFirstOrThrowArgs} args - Arguments to find a Guardian
     * @example
     * // Get one Guardian
     * const guardian = await prisma.guardian.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuardianFindFirstOrThrowArgs>(args?: SelectSubset<T, GuardianFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Guardians that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Guardians
     * const guardians = await prisma.guardian.findMany()
     * 
     * // Get first 10 Guardians
     * const guardians = await prisma.guardian.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guardianWithIdOnly = await prisma.guardian.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuardianFindManyArgs>(args?: SelectSubset<T, GuardianFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Guardian.
     * @param {GuardianCreateArgs} args - Arguments to create a Guardian.
     * @example
     * // Create one Guardian
     * const Guardian = await prisma.guardian.create({
     *   data: {
     *     // ... data to create a Guardian
     *   }
     * })
     * 
     */
    create<T extends GuardianCreateArgs>(args: SelectSubset<T, GuardianCreateArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Guardians.
     * @param {GuardianCreateManyArgs} args - Arguments to create many Guardians.
     * @example
     * // Create many Guardians
     * const guardian = await prisma.guardian.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuardianCreateManyArgs>(args?: SelectSubset<T, GuardianCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Guardians and returns the data saved in the database.
     * @param {GuardianCreateManyAndReturnArgs} args - Arguments to create many Guardians.
     * @example
     * // Create many Guardians
     * const guardian = await prisma.guardian.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Guardians and only return the `id`
     * const guardianWithIdOnly = await prisma.guardian.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuardianCreateManyAndReturnArgs>(args?: SelectSubset<T, GuardianCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Guardian.
     * @param {GuardianDeleteArgs} args - Arguments to delete one Guardian.
     * @example
     * // Delete one Guardian
     * const Guardian = await prisma.guardian.delete({
     *   where: {
     *     // ... filter to delete one Guardian
     *   }
     * })
     * 
     */
    delete<T extends GuardianDeleteArgs>(args: SelectSubset<T, GuardianDeleteArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Guardian.
     * @param {GuardianUpdateArgs} args - Arguments to update one Guardian.
     * @example
     * // Update one Guardian
     * const guardian = await prisma.guardian.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuardianUpdateArgs>(args: SelectSubset<T, GuardianUpdateArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Guardians.
     * @param {GuardianDeleteManyArgs} args - Arguments to filter Guardians to delete.
     * @example
     * // Delete a few Guardians
     * const { count } = await prisma.guardian.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuardianDeleteManyArgs>(args?: SelectSubset<T, GuardianDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Guardians.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Guardians
     * const guardian = await prisma.guardian.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuardianUpdateManyArgs>(args: SelectSubset<T, GuardianUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Guardian.
     * @param {GuardianUpsertArgs} args - Arguments to update or create a Guardian.
     * @example
     * // Update or create a Guardian
     * const guardian = await prisma.guardian.upsert({
     *   create: {
     *     // ... data to create a Guardian
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Guardian we want to update
     *   }
     * })
     */
    upsert<T extends GuardianUpsertArgs>(args: SelectSubset<T, GuardianUpsertArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Guardians.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianCountArgs} args - Arguments to filter Guardians to count.
     * @example
     * // Count the number of Guardians
     * const count = await prisma.guardian.count({
     *   where: {
     *     // ... the filter for the Guardians we want to count
     *   }
     * })
    **/
    count<T extends GuardianCountArgs>(
      args?: Subset<T, GuardianCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuardianCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Guardian.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GuardianAggregateArgs>(args: Subset<T, GuardianAggregateArgs>): Prisma.PrismaPromise<GetGuardianAggregateType<T>>

    /**
     * Group by Guardian.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GuardianGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuardianGroupByArgs['orderBy'] }
        : { orderBy?: GuardianGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuardianGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuardianGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Guardian model
   */
  readonly fields: GuardianFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Guardian.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuardianClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    students<T extends Guardian$studentsArgs<ExtArgs> = {}>(args?: Subset<T, Guardian$studentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Guardian model
   */ 
  interface GuardianFieldRefs {
    readonly id: FieldRef<"Guardian", 'String'>
    readonly userId: FieldRef<"Guardian", 'String'>
    readonly createdAt: FieldRef<"Guardian", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Guardian findUnique
   */
  export type GuardianFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter, which Guardian to fetch.
     */
    where: GuardianWhereUniqueInput
  }

  /**
   * Guardian findUniqueOrThrow
   */
  export type GuardianFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter, which Guardian to fetch.
     */
    where: GuardianWhereUniqueInput
  }

  /**
   * Guardian findFirst
   */
  export type GuardianFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter, which Guardian to fetch.
     */
    where?: GuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guardians to fetch.
     */
    orderBy?: GuardianOrderByWithRelationInput | GuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guardians.
     */
    cursor?: GuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guardians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guardians.
     */
    distinct?: GuardianScalarFieldEnum | GuardianScalarFieldEnum[]
  }

  /**
   * Guardian findFirstOrThrow
   */
  export type GuardianFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter, which Guardian to fetch.
     */
    where?: GuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guardians to fetch.
     */
    orderBy?: GuardianOrderByWithRelationInput | GuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guardians.
     */
    cursor?: GuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guardians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guardians.
     */
    distinct?: GuardianScalarFieldEnum | GuardianScalarFieldEnum[]
  }

  /**
   * Guardian findMany
   */
  export type GuardianFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter, which Guardians to fetch.
     */
    where?: GuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guardians to fetch.
     */
    orderBy?: GuardianOrderByWithRelationInput | GuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Guardians.
     */
    cursor?: GuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guardians.
     */
    skip?: number
    distinct?: GuardianScalarFieldEnum | GuardianScalarFieldEnum[]
  }

  /**
   * Guardian create
   */
  export type GuardianCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * The data needed to create a Guardian.
     */
    data: XOR<GuardianCreateInput, GuardianUncheckedCreateInput>
  }

  /**
   * Guardian createMany
   */
  export type GuardianCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Guardians.
     */
    data: GuardianCreateManyInput | GuardianCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Guardian createManyAndReturn
   */
  export type GuardianCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Guardians.
     */
    data: GuardianCreateManyInput | GuardianCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Guardian update
   */
  export type GuardianUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * The data needed to update a Guardian.
     */
    data: XOR<GuardianUpdateInput, GuardianUncheckedUpdateInput>
    /**
     * Choose, which Guardian to update.
     */
    where: GuardianWhereUniqueInput
  }

  /**
   * Guardian updateMany
   */
  export type GuardianUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Guardians.
     */
    data: XOR<GuardianUpdateManyMutationInput, GuardianUncheckedUpdateManyInput>
    /**
     * Filter which Guardians to update
     */
    where?: GuardianWhereInput
  }

  /**
   * Guardian upsert
   */
  export type GuardianUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * The filter to search for the Guardian to update in case it exists.
     */
    where: GuardianWhereUniqueInput
    /**
     * In case the Guardian found by the `where` argument doesn't exist, create a new Guardian with this data.
     */
    create: XOR<GuardianCreateInput, GuardianUncheckedCreateInput>
    /**
     * In case the Guardian was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuardianUpdateInput, GuardianUncheckedUpdateInput>
  }

  /**
   * Guardian delete
   */
  export type GuardianDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter which Guardian to delete.
     */
    where: GuardianWhereUniqueInput
  }

  /**
   * Guardian deleteMany
   */
  export type GuardianDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guardians to delete
     */
    where?: GuardianWhereInput
  }

  /**
   * Guardian.students
   */
  export type Guardian$studentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
    where?: StudentGuardianWhereInput
    orderBy?: StudentGuardianOrderByWithRelationInput | StudentGuardianOrderByWithRelationInput[]
    cursor?: StudentGuardianWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentGuardianScalarFieldEnum | StudentGuardianScalarFieldEnum[]
  }

  /**
   * Guardian without action
   */
  export type GuardianDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
  }


  /**
   * Model StudentGuardian
   */

  export type AggregateStudentGuardian = {
    _count: StudentGuardianCountAggregateOutputType | null
    _min: StudentGuardianMinAggregateOutputType | null
    _max: StudentGuardianMaxAggregateOutputType | null
  }

  export type StudentGuardianMinAggregateOutputType = {
    studentProfileId: string | null
    guardianId: string | null
    relationship: string | null
  }

  export type StudentGuardianMaxAggregateOutputType = {
    studentProfileId: string | null
    guardianId: string | null
    relationship: string | null
  }

  export type StudentGuardianCountAggregateOutputType = {
    studentProfileId: number
    guardianId: number
    relationship: number
    _all: number
  }


  export type StudentGuardianMinAggregateInputType = {
    studentProfileId?: true
    guardianId?: true
    relationship?: true
  }

  export type StudentGuardianMaxAggregateInputType = {
    studentProfileId?: true
    guardianId?: true
    relationship?: true
  }

  export type StudentGuardianCountAggregateInputType = {
    studentProfileId?: true
    guardianId?: true
    relationship?: true
    _all?: true
  }

  export type StudentGuardianAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentGuardian to aggregate.
     */
    where?: StudentGuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentGuardians to fetch.
     */
    orderBy?: StudentGuardianOrderByWithRelationInput | StudentGuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentGuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentGuardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentGuardians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudentGuardians
    **/
    _count?: true | StudentGuardianCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentGuardianMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentGuardianMaxAggregateInputType
  }

  export type GetStudentGuardianAggregateType<T extends StudentGuardianAggregateArgs> = {
        [P in keyof T & keyof AggregateStudentGuardian]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudentGuardian[P]>
      : GetScalarType<T[P], AggregateStudentGuardian[P]>
  }




  export type StudentGuardianGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentGuardianWhereInput
    orderBy?: StudentGuardianOrderByWithAggregationInput | StudentGuardianOrderByWithAggregationInput[]
    by: StudentGuardianScalarFieldEnum[] | StudentGuardianScalarFieldEnum
    having?: StudentGuardianScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentGuardianCountAggregateInputType | true
    _min?: StudentGuardianMinAggregateInputType
    _max?: StudentGuardianMaxAggregateInputType
  }

  export type StudentGuardianGroupByOutputType = {
    studentProfileId: string
    guardianId: string
    relationship: string | null
    _count: StudentGuardianCountAggregateOutputType | null
    _min: StudentGuardianMinAggregateOutputType | null
    _max: StudentGuardianMaxAggregateOutputType | null
  }

  type GetStudentGuardianGroupByPayload<T extends StudentGuardianGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentGuardianGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentGuardianGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentGuardianGroupByOutputType[P]>
            : GetScalarType<T[P], StudentGuardianGroupByOutputType[P]>
        }
      >
    >


  export type StudentGuardianSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    studentProfileId?: boolean
    guardianId?: boolean
    relationship?: boolean
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    guardian?: boolean | GuardianDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentGuardian"]>

  export type StudentGuardianSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    studentProfileId?: boolean
    guardianId?: boolean
    relationship?: boolean
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    guardian?: boolean | GuardianDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentGuardian"]>

  export type StudentGuardianSelectScalar = {
    studentProfileId?: boolean
    guardianId?: boolean
    relationship?: boolean
  }

  export type StudentGuardianInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    guardian?: boolean | GuardianDefaultArgs<ExtArgs>
  }
  export type StudentGuardianIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    guardian?: boolean | GuardianDefaultArgs<ExtArgs>
  }

  export type $StudentGuardianPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentGuardian"
    objects: {
      student: Prisma.$StudentProfilePayload<ExtArgs>
      guardian: Prisma.$GuardianPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      studentProfileId: string
      guardianId: string
      relationship: string | null
    }, ExtArgs["result"]["studentGuardian"]>
    composites: {}
  }

  type StudentGuardianGetPayload<S extends boolean | null | undefined | StudentGuardianDefaultArgs> = $Result.GetResult<Prisma.$StudentGuardianPayload, S>

  type StudentGuardianCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StudentGuardianFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StudentGuardianCountAggregateInputType | true
    }

  export interface StudentGuardianDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudentGuardian'], meta: { name: 'StudentGuardian' } }
    /**
     * Find zero or one StudentGuardian that matches the filter.
     * @param {StudentGuardianFindUniqueArgs} args - Arguments to find a StudentGuardian
     * @example
     * // Get one StudentGuardian
     * const studentGuardian = await prisma.studentGuardian.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentGuardianFindUniqueArgs>(args: SelectSubset<T, StudentGuardianFindUniqueArgs<ExtArgs>>): Prisma__StudentGuardianClient<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StudentGuardian that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StudentGuardianFindUniqueOrThrowArgs} args - Arguments to find a StudentGuardian
     * @example
     * // Get one StudentGuardian
     * const studentGuardian = await prisma.studentGuardian.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentGuardianFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentGuardianFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentGuardianClient<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StudentGuardian that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGuardianFindFirstArgs} args - Arguments to find a StudentGuardian
     * @example
     * // Get one StudentGuardian
     * const studentGuardian = await prisma.studentGuardian.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentGuardianFindFirstArgs>(args?: SelectSubset<T, StudentGuardianFindFirstArgs<ExtArgs>>): Prisma__StudentGuardianClient<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StudentGuardian that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGuardianFindFirstOrThrowArgs} args - Arguments to find a StudentGuardian
     * @example
     * // Get one StudentGuardian
     * const studentGuardian = await prisma.studentGuardian.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentGuardianFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentGuardianFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentGuardianClient<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StudentGuardians that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGuardianFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudentGuardians
     * const studentGuardians = await prisma.studentGuardian.findMany()
     * 
     * // Get first 10 StudentGuardians
     * const studentGuardians = await prisma.studentGuardian.findMany({ take: 10 })
     * 
     * // Only select the `studentProfileId`
     * const studentGuardianWithStudentProfileIdOnly = await prisma.studentGuardian.findMany({ select: { studentProfileId: true } })
     * 
     */
    findMany<T extends StudentGuardianFindManyArgs>(args?: SelectSubset<T, StudentGuardianFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StudentGuardian.
     * @param {StudentGuardianCreateArgs} args - Arguments to create a StudentGuardian.
     * @example
     * // Create one StudentGuardian
     * const StudentGuardian = await prisma.studentGuardian.create({
     *   data: {
     *     // ... data to create a StudentGuardian
     *   }
     * })
     * 
     */
    create<T extends StudentGuardianCreateArgs>(args: SelectSubset<T, StudentGuardianCreateArgs<ExtArgs>>): Prisma__StudentGuardianClient<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StudentGuardians.
     * @param {StudentGuardianCreateManyArgs} args - Arguments to create many StudentGuardians.
     * @example
     * // Create many StudentGuardians
     * const studentGuardian = await prisma.studentGuardian.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentGuardianCreateManyArgs>(args?: SelectSubset<T, StudentGuardianCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudentGuardians and returns the data saved in the database.
     * @param {StudentGuardianCreateManyAndReturnArgs} args - Arguments to create many StudentGuardians.
     * @example
     * // Create many StudentGuardians
     * const studentGuardian = await prisma.studentGuardian.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudentGuardians and only return the `studentProfileId`
     * const studentGuardianWithStudentProfileIdOnly = await prisma.studentGuardian.createManyAndReturn({ 
     *   select: { studentProfileId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentGuardianCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentGuardianCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StudentGuardian.
     * @param {StudentGuardianDeleteArgs} args - Arguments to delete one StudentGuardian.
     * @example
     * // Delete one StudentGuardian
     * const StudentGuardian = await prisma.studentGuardian.delete({
     *   where: {
     *     // ... filter to delete one StudentGuardian
     *   }
     * })
     * 
     */
    delete<T extends StudentGuardianDeleteArgs>(args: SelectSubset<T, StudentGuardianDeleteArgs<ExtArgs>>): Prisma__StudentGuardianClient<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StudentGuardian.
     * @param {StudentGuardianUpdateArgs} args - Arguments to update one StudentGuardian.
     * @example
     * // Update one StudentGuardian
     * const studentGuardian = await prisma.studentGuardian.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentGuardianUpdateArgs>(args: SelectSubset<T, StudentGuardianUpdateArgs<ExtArgs>>): Prisma__StudentGuardianClient<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StudentGuardians.
     * @param {StudentGuardianDeleteManyArgs} args - Arguments to filter StudentGuardians to delete.
     * @example
     * // Delete a few StudentGuardians
     * const { count } = await prisma.studentGuardian.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentGuardianDeleteManyArgs>(args?: SelectSubset<T, StudentGuardianDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentGuardians.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGuardianUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudentGuardians
     * const studentGuardian = await prisma.studentGuardian.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentGuardianUpdateManyArgs>(args: SelectSubset<T, StudentGuardianUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StudentGuardian.
     * @param {StudentGuardianUpsertArgs} args - Arguments to update or create a StudentGuardian.
     * @example
     * // Update or create a StudentGuardian
     * const studentGuardian = await prisma.studentGuardian.upsert({
     *   create: {
     *     // ... data to create a StudentGuardian
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudentGuardian we want to update
     *   }
     * })
     */
    upsert<T extends StudentGuardianUpsertArgs>(args: SelectSubset<T, StudentGuardianUpsertArgs<ExtArgs>>): Prisma__StudentGuardianClient<$Result.GetResult<Prisma.$StudentGuardianPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StudentGuardians.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGuardianCountArgs} args - Arguments to filter StudentGuardians to count.
     * @example
     * // Count the number of StudentGuardians
     * const count = await prisma.studentGuardian.count({
     *   where: {
     *     // ... the filter for the StudentGuardians we want to count
     *   }
     * })
    **/
    count<T extends StudentGuardianCountArgs>(
      args?: Subset<T, StudentGuardianCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentGuardianCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudentGuardian.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGuardianAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentGuardianAggregateArgs>(args: Subset<T, StudentGuardianAggregateArgs>): Prisma.PrismaPromise<GetStudentGuardianAggregateType<T>>

    /**
     * Group by StudentGuardian.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGuardianGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentGuardianGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentGuardianGroupByArgs['orderBy'] }
        : { orderBy?: StudentGuardianGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentGuardianGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentGuardianGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudentGuardian model
   */
  readonly fields: StudentGuardianFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudentGuardian.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentGuardianClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfileDefaultArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    guardian<T extends GuardianDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GuardianDefaultArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StudentGuardian model
   */ 
  interface StudentGuardianFieldRefs {
    readonly studentProfileId: FieldRef<"StudentGuardian", 'String'>
    readonly guardianId: FieldRef<"StudentGuardian", 'String'>
    readonly relationship: FieldRef<"StudentGuardian", 'String'>
  }
    

  // Custom InputTypes
  /**
   * StudentGuardian findUnique
   */
  export type StudentGuardianFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
    /**
     * Filter, which StudentGuardian to fetch.
     */
    where: StudentGuardianWhereUniqueInput
  }

  /**
   * StudentGuardian findUniqueOrThrow
   */
  export type StudentGuardianFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
    /**
     * Filter, which StudentGuardian to fetch.
     */
    where: StudentGuardianWhereUniqueInput
  }

  /**
   * StudentGuardian findFirst
   */
  export type StudentGuardianFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
    /**
     * Filter, which StudentGuardian to fetch.
     */
    where?: StudentGuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentGuardians to fetch.
     */
    orderBy?: StudentGuardianOrderByWithRelationInput | StudentGuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentGuardians.
     */
    cursor?: StudentGuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentGuardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentGuardians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentGuardians.
     */
    distinct?: StudentGuardianScalarFieldEnum | StudentGuardianScalarFieldEnum[]
  }

  /**
   * StudentGuardian findFirstOrThrow
   */
  export type StudentGuardianFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
    /**
     * Filter, which StudentGuardian to fetch.
     */
    where?: StudentGuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentGuardians to fetch.
     */
    orderBy?: StudentGuardianOrderByWithRelationInput | StudentGuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentGuardians.
     */
    cursor?: StudentGuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentGuardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentGuardians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentGuardians.
     */
    distinct?: StudentGuardianScalarFieldEnum | StudentGuardianScalarFieldEnum[]
  }

  /**
   * StudentGuardian findMany
   */
  export type StudentGuardianFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
    /**
     * Filter, which StudentGuardians to fetch.
     */
    where?: StudentGuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentGuardians to fetch.
     */
    orderBy?: StudentGuardianOrderByWithRelationInput | StudentGuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudentGuardians.
     */
    cursor?: StudentGuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentGuardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentGuardians.
     */
    skip?: number
    distinct?: StudentGuardianScalarFieldEnum | StudentGuardianScalarFieldEnum[]
  }

  /**
   * StudentGuardian create
   */
  export type StudentGuardianCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
    /**
     * The data needed to create a StudentGuardian.
     */
    data: XOR<StudentGuardianCreateInput, StudentGuardianUncheckedCreateInput>
  }

  /**
   * StudentGuardian createMany
   */
  export type StudentGuardianCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudentGuardians.
     */
    data: StudentGuardianCreateManyInput | StudentGuardianCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StudentGuardian createManyAndReturn
   */
  export type StudentGuardianCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StudentGuardians.
     */
    data: StudentGuardianCreateManyInput | StudentGuardianCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentGuardian update
   */
  export type StudentGuardianUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
    /**
     * The data needed to update a StudentGuardian.
     */
    data: XOR<StudentGuardianUpdateInput, StudentGuardianUncheckedUpdateInput>
    /**
     * Choose, which StudentGuardian to update.
     */
    where: StudentGuardianWhereUniqueInput
  }

  /**
   * StudentGuardian updateMany
   */
  export type StudentGuardianUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudentGuardians.
     */
    data: XOR<StudentGuardianUpdateManyMutationInput, StudentGuardianUncheckedUpdateManyInput>
    /**
     * Filter which StudentGuardians to update
     */
    where?: StudentGuardianWhereInput
  }

  /**
   * StudentGuardian upsert
   */
  export type StudentGuardianUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
    /**
     * The filter to search for the StudentGuardian to update in case it exists.
     */
    where: StudentGuardianWhereUniqueInput
    /**
     * In case the StudentGuardian found by the `where` argument doesn't exist, create a new StudentGuardian with this data.
     */
    create: XOR<StudentGuardianCreateInput, StudentGuardianUncheckedCreateInput>
    /**
     * In case the StudentGuardian was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentGuardianUpdateInput, StudentGuardianUncheckedUpdateInput>
  }

  /**
   * StudentGuardian delete
   */
  export type StudentGuardianDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
    /**
     * Filter which StudentGuardian to delete.
     */
    where: StudentGuardianWhereUniqueInput
  }

  /**
   * StudentGuardian deleteMany
   */
  export type StudentGuardianDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentGuardians to delete
     */
    where?: StudentGuardianWhereInput
  }

  /**
   * StudentGuardian without action
   */
  export type StudentGuardianDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentGuardian
     */
    select?: StudentGuardianSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentGuardianInclude<ExtArgs> | null
  }


  /**
   * Model Discipline
   */

  export type AggregateDiscipline = {
    _count: DisciplineCountAggregateOutputType | null
    _min: DisciplineMinAggregateOutputType | null
    _max: DisciplineMaxAggregateOutputType | null
  }

  export type DisciplineMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type DisciplineMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
  }

  export type DisciplineCountAggregateOutputType = {
    id: number
    name: number
    description: number
    _all: number
  }


  export type DisciplineMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type DisciplineMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
  }

  export type DisciplineCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    _all?: true
  }

  export type DisciplineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Discipline to aggregate.
     */
    where?: DisciplineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disciplines to fetch.
     */
    orderBy?: DisciplineOrderByWithRelationInput | DisciplineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DisciplineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disciplines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disciplines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Disciplines
    **/
    _count?: true | DisciplineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DisciplineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DisciplineMaxAggregateInputType
  }

  export type GetDisciplineAggregateType<T extends DisciplineAggregateArgs> = {
        [P in keyof T & keyof AggregateDiscipline]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiscipline[P]>
      : GetScalarType<T[P], AggregateDiscipline[P]>
  }




  export type DisciplineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DisciplineWhereInput
    orderBy?: DisciplineOrderByWithAggregationInput | DisciplineOrderByWithAggregationInput[]
    by: DisciplineScalarFieldEnum[] | DisciplineScalarFieldEnum
    having?: DisciplineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DisciplineCountAggregateInputType | true
    _min?: DisciplineMinAggregateInputType
    _max?: DisciplineMaxAggregateInputType
  }

  export type DisciplineGroupByOutputType = {
    id: string
    name: string
    description: string | null
    _count: DisciplineCountAggregateOutputType | null
    _min: DisciplineMinAggregateOutputType | null
    _max: DisciplineMaxAggregateOutputType | null
  }

  type GetDisciplineGroupByPayload<T extends DisciplineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DisciplineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DisciplineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DisciplineGroupByOutputType[P]>
            : GetScalarType<T[P], DisciplineGroupByOutputType[P]>
        }
      >
    >


  export type DisciplineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    programs?: boolean | Discipline$programsArgs<ExtArgs>
    _count?: boolean | DisciplineCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["discipline"]>

  export type DisciplineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
  }, ExtArgs["result"]["discipline"]>

  export type DisciplineSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
  }

  export type DisciplineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    programs?: boolean | Discipline$programsArgs<ExtArgs>
    _count?: boolean | DisciplineCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DisciplineIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DisciplinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Discipline"
    objects: {
      programs: Prisma.$DisciplineProgramPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
    }, ExtArgs["result"]["discipline"]>
    composites: {}
  }

  type DisciplineGetPayload<S extends boolean | null | undefined | DisciplineDefaultArgs> = $Result.GetResult<Prisma.$DisciplinePayload, S>

  type DisciplineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DisciplineFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DisciplineCountAggregateInputType | true
    }

  export interface DisciplineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Discipline'], meta: { name: 'Discipline' } }
    /**
     * Find zero or one Discipline that matches the filter.
     * @param {DisciplineFindUniqueArgs} args - Arguments to find a Discipline
     * @example
     * // Get one Discipline
     * const discipline = await prisma.discipline.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DisciplineFindUniqueArgs>(args: SelectSubset<T, DisciplineFindUniqueArgs<ExtArgs>>): Prisma__DisciplineClient<$Result.GetResult<Prisma.$DisciplinePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Discipline that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DisciplineFindUniqueOrThrowArgs} args - Arguments to find a Discipline
     * @example
     * // Get one Discipline
     * const discipline = await prisma.discipline.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DisciplineFindUniqueOrThrowArgs>(args: SelectSubset<T, DisciplineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DisciplineClient<$Result.GetResult<Prisma.$DisciplinePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Discipline that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineFindFirstArgs} args - Arguments to find a Discipline
     * @example
     * // Get one Discipline
     * const discipline = await prisma.discipline.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DisciplineFindFirstArgs>(args?: SelectSubset<T, DisciplineFindFirstArgs<ExtArgs>>): Prisma__DisciplineClient<$Result.GetResult<Prisma.$DisciplinePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Discipline that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineFindFirstOrThrowArgs} args - Arguments to find a Discipline
     * @example
     * // Get one Discipline
     * const discipline = await prisma.discipline.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DisciplineFindFirstOrThrowArgs>(args?: SelectSubset<T, DisciplineFindFirstOrThrowArgs<ExtArgs>>): Prisma__DisciplineClient<$Result.GetResult<Prisma.$DisciplinePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Disciplines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Disciplines
     * const disciplines = await prisma.discipline.findMany()
     * 
     * // Get first 10 Disciplines
     * const disciplines = await prisma.discipline.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const disciplineWithIdOnly = await prisma.discipline.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DisciplineFindManyArgs>(args?: SelectSubset<T, DisciplineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisciplinePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Discipline.
     * @param {DisciplineCreateArgs} args - Arguments to create a Discipline.
     * @example
     * // Create one Discipline
     * const Discipline = await prisma.discipline.create({
     *   data: {
     *     // ... data to create a Discipline
     *   }
     * })
     * 
     */
    create<T extends DisciplineCreateArgs>(args: SelectSubset<T, DisciplineCreateArgs<ExtArgs>>): Prisma__DisciplineClient<$Result.GetResult<Prisma.$DisciplinePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Disciplines.
     * @param {DisciplineCreateManyArgs} args - Arguments to create many Disciplines.
     * @example
     * // Create many Disciplines
     * const discipline = await prisma.discipline.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DisciplineCreateManyArgs>(args?: SelectSubset<T, DisciplineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Disciplines and returns the data saved in the database.
     * @param {DisciplineCreateManyAndReturnArgs} args - Arguments to create many Disciplines.
     * @example
     * // Create many Disciplines
     * const discipline = await prisma.discipline.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Disciplines and only return the `id`
     * const disciplineWithIdOnly = await prisma.discipline.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DisciplineCreateManyAndReturnArgs>(args?: SelectSubset<T, DisciplineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisciplinePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Discipline.
     * @param {DisciplineDeleteArgs} args - Arguments to delete one Discipline.
     * @example
     * // Delete one Discipline
     * const Discipline = await prisma.discipline.delete({
     *   where: {
     *     // ... filter to delete one Discipline
     *   }
     * })
     * 
     */
    delete<T extends DisciplineDeleteArgs>(args: SelectSubset<T, DisciplineDeleteArgs<ExtArgs>>): Prisma__DisciplineClient<$Result.GetResult<Prisma.$DisciplinePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Discipline.
     * @param {DisciplineUpdateArgs} args - Arguments to update one Discipline.
     * @example
     * // Update one Discipline
     * const discipline = await prisma.discipline.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DisciplineUpdateArgs>(args: SelectSubset<T, DisciplineUpdateArgs<ExtArgs>>): Prisma__DisciplineClient<$Result.GetResult<Prisma.$DisciplinePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Disciplines.
     * @param {DisciplineDeleteManyArgs} args - Arguments to filter Disciplines to delete.
     * @example
     * // Delete a few Disciplines
     * const { count } = await prisma.discipline.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DisciplineDeleteManyArgs>(args?: SelectSubset<T, DisciplineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Disciplines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Disciplines
     * const discipline = await prisma.discipline.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DisciplineUpdateManyArgs>(args: SelectSubset<T, DisciplineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Discipline.
     * @param {DisciplineUpsertArgs} args - Arguments to update or create a Discipline.
     * @example
     * // Update or create a Discipline
     * const discipline = await prisma.discipline.upsert({
     *   create: {
     *     // ... data to create a Discipline
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Discipline we want to update
     *   }
     * })
     */
    upsert<T extends DisciplineUpsertArgs>(args: SelectSubset<T, DisciplineUpsertArgs<ExtArgs>>): Prisma__DisciplineClient<$Result.GetResult<Prisma.$DisciplinePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Disciplines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineCountArgs} args - Arguments to filter Disciplines to count.
     * @example
     * // Count the number of Disciplines
     * const count = await prisma.discipline.count({
     *   where: {
     *     // ... the filter for the Disciplines we want to count
     *   }
     * })
    **/
    count<T extends DisciplineCountArgs>(
      args?: Subset<T, DisciplineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DisciplineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Discipline.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DisciplineAggregateArgs>(args: Subset<T, DisciplineAggregateArgs>): Prisma.PrismaPromise<GetDisciplineAggregateType<T>>

    /**
     * Group by Discipline.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DisciplineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DisciplineGroupByArgs['orderBy'] }
        : { orderBy?: DisciplineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DisciplineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDisciplineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Discipline model
   */
  readonly fields: DisciplineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Discipline.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DisciplineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    programs<T extends Discipline$programsArgs<ExtArgs> = {}>(args?: Subset<T, Discipline$programsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Discipline model
   */ 
  interface DisciplineFieldRefs {
    readonly id: FieldRef<"Discipline", 'String'>
    readonly name: FieldRef<"Discipline", 'String'>
    readonly description: FieldRef<"Discipline", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Discipline findUnique
   */
  export type DisciplineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Discipline
     */
    select?: DisciplineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineInclude<ExtArgs> | null
    /**
     * Filter, which Discipline to fetch.
     */
    where: DisciplineWhereUniqueInput
  }

  /**
   * Discipline findUniqueOrThrow
   */
  export type DisciplineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Discipline
     */
    select?: DisciplineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineInclude<ExtArgs> | null
    /**
     * Filter, which Discipline to fetch.
     */
    where: DisciplineWhereUniqueInput
  }

  /**
   * Discipline findFirst
   */
  export type DisciplineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Discipline
     */
    select?: DisciplineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineInclude<ExtArgs> | null
    /**
     * Filter, which Discipline to fetch.
     */
    where?: DisciplineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disciplines to fetch.
     */
    orderBy?: DisciplineOrderByWithRelationInput | DisciplineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Disciplines.
     */
    cursor?: DisciplineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disciplines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disciplines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Disciplines.
     */
    distinct?: DisciplineScalarFieldEnum | DisciplineScalarFieldEnum[]
  }

  /**
   * Discipline findFirstOrThrow
   */
  export type DisciplineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Discipline
     */
    select?: DisciplineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineInclude<ExtArgs> | null
    /**
     * Filter, which Discipline to fetch.
     */
    where?: DisciplineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disciplines to fetch.
     */
    orderBy?: DisciplineOrderByWithRelationInput | DisciplineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Disciplines.
     */
    cursor?: DisciplineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disciplines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disciplines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Disciplines.
     */
    distinct?: DisciplineScalarFieldEnum | DisciplineScalarFieldEnum[]
  }

  /**
   * Discipline findMany
   */
  export type DisciplineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Discipline
     */
    select?: DisciplineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineInclude<ExtArgs> | null
    /**
     * Filter, which Disciplines to fetch.
     */
    where?: DisciplineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Disciplines to fetch.
     */
    orderBy?: DisciplineOrderByWithRelationInput | DisciplineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Disciplines.
     */
    cursor?: DisciplineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Disciplines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Disciplines.
     */
    skip?: number
    distinct?: DisciplineScalarFieldEnum | DisciplineScalarFieldEnum[]
  }

  /**
   * Discipline create
   */
  export type DisciplineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Discipline
     */
    select?: DisciplineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineInclude<ExtArgs> | null
    /**
     * The data needed to create a Discipline.
     */
    data: XOR<DisciplineCreateInput, DisciplineUncheckedCreateInput>
  }

  /**
   * Discipline createMany
   */
  export type DisciplineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Disciplines.
     */
    data: DisciplineCreateManyInput | DisciplineCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Discipline createManyAndReturn
   */
  export type DisciplineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Discipline
     */
    select?: DisciplineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Disciplines.
     */
    data: DisciplineCreateManyInput | DisciplineCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Discipline update
   */
  export type DisciplineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Discipline
     */
    select?: DisciplineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineInclude<ExtArgs> | null
    /**
     * The data needed to update a Discipline.
     */
    data: XOR<DisciplineUpdateInput, DisciplineUncheckedUpdateInput>
    /**
     * Choose, which Discipline to update.
     */
    where: DisciplineWhereUniqueInput
  }

  /**
   * Discipline updateMany
   */
  export type DisciplineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Disciplines.
     */
    data: XOR<DisciplineUpdateManyMutationInput, DisciplineUncheckedUpdateManyInput>
    /**
     * Filter which Disciplines to update
     */
    where?: DisciplineWhereInput
  }

  /**
   * Discipline upsert
   */
  export type DisciplineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Discipline
     */
    select?: DisciplineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineInclude<ExtArgs> | null
    /**
     * The filter to search for the Discipline to update in case it exists.
     */
    where: DisciplineWhereUniqueInput
    /**
     * In case the Discipline found by the `where` argument doesn't exist, create a new Discipline with this data.
     */
    create: XOR<DisciplineCreateInput, DisciplineUncheckedCreateInput>
    /**
     * In case the Discipline was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DisciplineUpdateInput, DisciplineUncheckedUpdateInput>
  }

  /**
   * Discipline delete
   */
  export type DisciplineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Discipline
     */
    select?: DisciplineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineInclude<ExtArgs> | null
    /**
     * Filter which Discipline to delete.
     */
    where: DisciplineWhereUniqueInput
  }

  /**
   * Discipline deleteMany
   */
  export type DisciplineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Disciplines to delete
     */
    where?: DisciplineWhereInput
  }

  /**
   * Discipline.programs
   */
  export type Discipline$programsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramInclude<ExtArgs> | null
    where?: DisciplineProgramWhereInput
    orderBy?: DisciplineProgramOrderByWithRelationInput | DisciplineProgramOrderByWithRelationInput[]
    cursor?: DisciplineProgramWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DisciplineProgramScalarFieldEnum | DisciplineProgramScalarFieldEnum[]
  }

  /**
   * Discipline without action
   */
  export type DisciplineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Discipline
     */
    select?: DisciplineSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineInclude<ExtArgs> | null
  }


  /**
   * Model DisciplineProgram
   */

  export type AggregateDisciplineProgram = {
    _count: DisciplineProgramCountAggregateOutputType | null
    _avg: DisciplineProgramAvgAggregateOutputType | null
    _sum: DisciplineProgramSumAggregateOutputType | null
    _min: DisciplineProgramMinAggregateOutputType | null
    _max: DisciplineProgramMaxAggregateOutputType | null
  }

  export type DisciplineProgramAvgAggregateOutputType = {
    minAge: number | null
    maxAge: number | null
  }

  export type DisciplineProgramSumAggregateOutputType = {
    minAge: number | null
    maxAge: number | null
  }

  export type DisciplineProgramMinAggregateOutputType = {
    id: string | null
    disciplineId: string | null
    name: string | null
    minAge: number | null
    maxAge: number | null
  }

  export type DisciplineProgramMaxAggregateOutputType = {
    id: string | null
    disciplineId: string | null
    name: string | null
    minAge: number | null
    maxAge: number | null
  }

  export type DisciplineProgramCountAggregateOutputType = {
    id: number
    disciplineId: number
    name: number
    minAge: number
    maxAge: number
    _all: number
  }


  export type DisciplineProgramAvgAggregateInputType = {
    minAge?: true
    maxAge?: true
  }

  export type DisciplineProgramSumAggregateInputType = {
    minAge?: true
    maxAge?: true
  }

  export type DisciplineProgramMinAggregateInputType = {
    id?: true
    disciplineId?: true
    name?: true
    minAge?: true
    maxAge?: true
  }

  export type DisciplineProgramMaxAggregateInputType = {
    id?: true
    disciplineId?: true
    name?: true
    minAge?: true
    maxAge?: true
  }

  export type DisciplineProgramCountAggregateInputType = {
    id?: true
    disciplineId?: true
    name?: true
    minAge?: true
    maxAge?: true
    _all?: true
  }

  export type DisciplineProgramAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DisciplineProgram to aggregate.
     */
    where?: DisciplineProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DisciplinePrograms to fetch.
     */
    orderBy?: DisciplineProgramOrderByWithRelationInput | DisciplineProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DisciplineProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DisciplinePrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DisciplinePrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DisciplinePrograms
    **/
    _count?: true | DisciplineProgramCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DisciplineProgramAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DisciplineProgramSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DisciplineProgramMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DisciplineProgramMaxAggregateInputType
  }

  export type GetDisciplineProgramAggregateType<T extends DisciplineProgramAggregateArgs> = {
        [P in keyof T & keyof AggregateDisciplineProgram]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDisciplineProgram[P]>
      : GetScalarType<T[P], AggregateDisciplineProgram[P]>
  }




  export type DisciplineProgramGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DisciplineProgramWhereInput
    orderBy?: DisciplineProgramOrderByWithAggregationInput | DisciplineProgramOrderByWithAggregationInput[]
    by: DisciplineProgramScalarFieldEnum[] | DisciplineProgramScalarFieldEnum
    having?: DisciplineProgramScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DisciplineProgramCountAggregateInputType | true
    _avg?: DisciplineProgramAvgAggregateInputType
    _sum?: DisciplineProgramSumAggregateInputType
    _min?: DisciplineProgramMinAggregateInputType
    _max?: DisciplineProgramMaxAggregateInputType
  }

  export type DisciplineProgramGroupByOutputType = {
    id: string
    disciplineId: string
    name: string
    minAge: number
    maxAge: number
    _count: DisciplineProgramCountAggregateOutputType | null
    _avg: DisciplineProgramAvgAggregateOutputType | null
    _sum: DisciplineProgramSumAggregateOutputType | null
    _min: DisciplineProgramMinAggregateOutputType | null
    _max: DisciplineProgramMaxAggregateOutputType | null
  }

  type GetDisciplineProgramGroupByPayload<T extends DisciplineProgramGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DisciplineProgramGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DisciplineProgramGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DisciplineProgramGroupByOutputType[P]>
            : GetScalarType<T[P], DisciplineProgramGroupByOutputType[P]>
        }
      >
    >


  export type DisciplineProgramSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    disciplineId?: boolean
    name?: boolean
    minAge?: boolean
    maxAge?: boolean
    discipline?: boolean | DisciplineDefaultArgs<ExtArgs>
    beltRanks?: boolean | DisciplineProgram$beltRanksArgs<ExtArgs>
    _count?: boolean | DisciplineProgramCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["disciplineProgram"]>

  export type DisciplineProgramSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    disciplineId?: boolean
    name?: boolean
    minAge?: boolean
    maxAge?: boolean
    discipline?: boolean | DisciplineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["disciplineProgram"]>

  export type DisciplineProgramSelectScalar = {
    id?: boolean
    disciplineId?: boolean
    name?: boolean
    minAge?: boolean
    maxAge?: boolean
  }

  export type DisciplineProgramInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    discipline?: boolean | DisciplineDefaultArgs<ExtArgs>
    beltRanks?: boolean | DisciplineProgram$beltRanksArgs<ExtArgs>
    _count?: boolean | DisciplineProgramCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DisciplineProgramIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    discipline?: boolean | DisciplineDefaultArgs<ExtArgs>
  }

  export type $DisciplineProgramPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DisciplineProgram"
    objects: {
      discipline: Prisma.$DisciplinePayload<ExtArgs>
      beltRanks: Prisma.$BeltRankPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      disciplineId: string
      name: string
      minAge: number
      maxAge: number
    }, ExtArgs["result"]["disciplineProgram"]>
    composites: {}
  }

  type DisciplineProgramGetPayload<S extends boolean | null | undefined | DisciplineProgramDefaultArgs> = $Result.GetResult<Prisma.$DisciplineProgramPayload, S>

  type DisciplineProgramCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DisciplineProgramFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DisciplineProgramCountAggregateInputType | true
    }

  export interface DisciplineProgramDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DisciplineProgram'], meta: { name: 'DisciplineProgram' } }
    /**
     * Find zero or one DisciplineProgram that matches the filter.
     * @param {DisciplineProgramFindUniqueArgs} args - Arguments to find a DisciplineProgram
     * @example
     * // Get one DisciplineProgram
     * const disciplineProgram = await prisma.disciplineProgram.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DisciplineProgramFindUniqueArgs>(args: SelectSubset<T, DisciplineProgramFindUniqueArgs<ExtArgs>>): Prisma__DisciplineProgramClient<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DisciplineProgram that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DisciplineProgramFindUniqueOrThrowArgs} args - Arguments to find a DisciplineProgram
     * @example
     * // Get one DisciplineProgram
     * const disciplineProgram = await prisma.disciplineProgram.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DisciplineProgramFindUniqueOrThrowArgs>(args: SelectSubset<T, DisciplineProgramFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DisciplineProgramClient<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DisciplineProgram that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineProgramFindFirstArgs} args - Arguments to find a DisciplineProgram
     * @example
     * // Get one DisciplineProgram
     * const disciplineProgram = await prisma.disciplineProgram.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DisciplineProgramFindFirstArgs>(args?: SelectSubset<T, DisciplineProgramFindFirstArgs<ExtArgs>>): Prisma__DisciplineProgramClient<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DisciplineProgram that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineProgramFindFirstOrThrowArgs} args - Arguments to find a DisciplineProgram
     * @example
     * // Get one DisciplineProgram
     * const disciplineProgram = await prisma.disciplineProgram.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DisciplineProgramFindFirstOrThrowArgs>(args?: SelectSubset<T, DisciplineProgramFindFirstOrThrowArgs<ExtArgs>>): Prisma__DisciplineProgramClient<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DisciplinePrograms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineProgramFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DisciplinePrograms
     * const disciplinePrograms = await prisma.disciplineProgram.findMany()
     * 
     * // Get first 10 DisciplinePrograms
     * const disciplinePrograms = await prisma.disciplineProgram.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const disciplineProgramWithIdOnly = await prisma.disciplineProgram.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DisciplineProgramFindManyArgs>(args?: SelectSubset<T, DisciplineProgramFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DisciplineProgram.
     * @param {DisciplineProgramCreateArgs} args - Arguments to create a DisciplineProgram.
     * @example
     * // Create one DisciplineProgram
     * const DisciplineProgram = await prisma.disciplineProgram.create({
     *   data: {
     *     // ... data to create a DisciplineProgram
     *   }
     * })
     * 
     */
    create<T extends DisciplineProgramCreateArgs>(args: SelectSubset<T, DisciplineProgramCreateArgs<ExtArgs>>): Prisma__DisciplineProgramClient<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DisciplinePrograms.
     * @param {DisciplineProgramCreateManyArgs} args - Arguments to create many DisciplinePrograms.
     * @example
     * // Create many DisciplinePrograms
     * const disciplineProgram = await prisma.disciplineProgram.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DisciplineProgramCreateManyArgs>(args?: SelectSubset<T, DisciplineProgramCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DisciplinePrograms and returns the data saved in the database.
     * @param {DisciplineProgramCreateManyAndReturnArgs} args - Arguments to create many DisciplinePrograms.
     * @example
     * // Create many DisciplinePrograms
     * const disciplineProgram = await prisma.disciplineProgram.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DisciplinePrograms and only return the `id`
     * const disciplineProgramWithIdOnly = await prisma.disciplineProgram.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DisciplineProgramCreateManyAndReturnArgs>(args?: SelectSubset<T, DisciplineProgramCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DisciplineProgram.
     * @param {DisciplineProgramDeleteArgs} args - Arguments to delete one DisciplineProgram.
     * @example
     * // Delete one DisciplineProgram
     * const DisciplineProgram = await prisma.disciplineProgram.delete({
     *   where: {
     *     // ... filter to delete one DisciplineProgram
     *   }
     * })
     * 
     */
    delete<T extends DisciplineProgramDeleteArgs>(args: SelectSubset<T, DisciplineProgramDeleteArgs<ExtArgs>>): Prisma__DisciplineProgramClient<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DisciplineProgram.
     * @param {DisciplineProgramUpdateArgs} args - Arguments to update one DisciplineProgram.
     * @example
     * // Update one DisciplineProgram
     * const disciplineProgram = await prisma.disciplineProgram.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DisciplineProgramUpdateArgs>(args: SelectSubset<T, DisciplineProgramUpdateArgs<ExtArgs>>): Prisma__DisciplineProgramClient<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DisciplinePrograms.
     * @param {DisciplineProgramDeleteManyArgs} args - Arguments to filter DisciplinePrograms to delete.
     * @example
     * // Delete a few DisciplinePrograms
     * const { count } = await prisma.disciplineProgram.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DisciplineProgramDeleteManyArgs>(args?: SelectSubset<T, DisciplineProgramDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DisciplinePrograms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineProgramUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DisciplinePrograms
     * const disciplineProgram = await prisma.disciplineProgram.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DisciplineProgramUpdateManyArgs>(args: SelectSubset<T, DisciplineProgramUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DisciplineProgram.
     * @param {DisciplineProgramUpsertArgs} args - Arguments to update or create a DisciplineProgram.
     * @example
     * // Update or create a DisciplineProgram
     * const disciplineProgram = await prisma.disciplineProgram.upsert({
     *   create: {
     *     // ... data to create a DisciplineProgram
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DisciplineProgram we want to update
     *   }
     * })
     */
    upsert<T extends DisciplineProgramUpsertArgs>(args: SelectSubset<T, DisciplineProgramUpsertArgs<ExtArgs>>): Prisma__DisciplineProgramClient<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DisciplinePrograms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineProgramCountArgs} args - Arguments to filter DisciplinePrograms to count.
     * @example
     * // Count the number of DisciplinePrograms
     * const count = await prisma.disciplineProgram.count({
     *   where: {
     *     // ... the filter for the DisciplinePrograms we want to count
     *   }
     * })
    **/
    count<T extends DisciplineProgramCountArgs>(
      args?: Subset<T, DisciplineProgramCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DisciplineProgramCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DisciplineProgram.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineProgramAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DisciplineProgramAggregateArgs>(args: Subset<T, DisciplineProgramAggregateArgs>): Prisma.PrismaPromise<GetDisciplineProgramAggregateType<T>>

    /**
     * Group by DisciplineProgram.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DisciplineProgramGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DisciplineProgramGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DisciplineProgramGroupByArgs['orderBy'] }
        : { orderBy?: DisciplineProgramGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DisciplineProgramGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDisciplineProgramGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DisciplineProgram model
   */
  readonly fields: DisciplineProgramFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DisciplineProgram.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DisciplineProgramClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    discipline<T extends DisciplineDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DisciplineDefaultArgs<ExtArgs>>): Prisma__DisciplineClient<$Result.GetResult<Prisma.$DisciplinePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    beltRanks<T extends DisciplineProgram$beltRanksArgs<ExtArgs> = {}>(args?: Subset<T, DisciplineProgram$beltRanksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DisciplineProgram model
   */ 
  interface DisciplineProgramFieldRefs {
    readonly id: FieldRef<"DisciplineProgram", 'String'>
    readonly disciplineId: FieldRef<"DisciplineProgram", 'String'>
    readonly name: FieldRef<"DisciplineProgram", 'String'>
    readonly minAge: FieldRef<"DisciplineProgram", 'Int'>
    readonly maxAge: FieldRef<"DisciplineProgram", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * DisciplineProgram findUnique
   */
  export type DisciplineProgramFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramInclude<ExtArgs> | null
    /**
     * Filter, which DisciplineProgram to fetch.
     */
    where: DisciplineProgramWhereUniqueInput
  }

  /**
   * DisciplineProgram findUniqueOrThrow
   */
  export type DisciplineProgramFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramInclude<ExtArgs> | null
    /**
     * Filter, which DisciplineProgram to fetch.
     */
    where: DisciplineProgramWhereUniqueInput
  }

  /**
   * DisciplineProgram findFirst
   */
  export type DisciplineProgramFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramInclude<ExtArgs> | null
    /**
     * Filter, which DisciplineProgram to fetch.
     */
    where?: DisciplineProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DisciplinePrograms to fetch.
     */
    orderBy?: DisciplineProgramOrderByWithRelationInput | DisciplineProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DisciplinePrograms.
     */
    cursor?: DisciplineProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DisciplinePrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DisciplinePrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DisciplinePrograms.
     */
    distinct?: DisciplineProgramScalarFieldEnum | DisciplineProgramScalarFieldEnum[]
  }

  /**
   * DisciplineProgram findFirstOrThrow
   */
  export type DisciplineProgramFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramInclude<ExtArgs> | null
    /**
     * Filter, which DisciplineProgram to fetch.
     */
    where?: DisciplineProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DisciplinePrograms to fetch.
     */
    orderBy?: DisciplineProgramOrderByWithRelationInput | DisciplineProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DisciplinePrograms.
     */
    cursor?: DisciplineProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DisciplinePrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DisciplinePrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DisciplinePrograms.
     */
    distinct?: DisciplineProgramScalarFieldEnum | DisciplineProgramScalarFieldEnum[]
  }

  /**
   * DisciplineProgram findMany
   */
  export type DisciplineProgramFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramInclude<ExtArgs> | null
    /**
     * Filter, which DisciplinePrograms to fetch.
     */
    where?: DisciplineProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DisciplinePrograms to fetch.
     */
    orderBy?: DisciplineProgramOrderByWithRelationInput | DisciplineProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DisciplinePrograms.
     */
    cursor?: DisciplineProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DisciplinePrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DisciplinePrograms.
     */
    skip?: number
    distinct?: DisciplineProgramScalarFieldEnum | DisciplineProgramScalarFieldEnum[]
  }

  /**
   * DisciplineProgram create
   */
  export type DisciplineProgramCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramInclude<ExtArgs> | null
    /**
     * The data needed to create a DisciplineProgram.
     */
    data: XOR<DisciplineProgramCreateInput, DisciplineProgramUncheckedCreateInput>
  }

  /**
   * DisciplineProgram createMany
   */
  export type DisciplineProgramCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DisciplinePrograms.
     */
    data: DisciplineProgramCreateManyInput | DisciplineProgramCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DisciplineProgram createManyAndReturn
   */
  export type DisciplineProgramCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DisciplinePrograms.
     */
    data: DisciplineProgramCreateManyInput | DisciplineProgramCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DisciplineProgram update
   */
  export type DisciplineProgramUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramInclude<ExtArgs> | null
    /**
     * The data needed to update a DisciplineProgram.
     */
    data: XOR<DisciplineProgramUpdateInput, DisciplineProgramUncheckedUpdateInput>
    /**
     * Choose, which DisciplineProgram to update.
     */
    where: DisciplineProgramWhereUniqueInput
  }

  /**
   * DisciplineProgram updateMany
   */
  export type DisciplineProgramUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DisciplinePrograms.
     */
    data: XOR<DisciplineProgramUpdateManyMutationInput, DisciplineProgramUncheckedUpdateManyInput>
    /**
     * Filter which DisciplinePrograms to update
     */
    where?: DisciplineProgramWhereInput
  }

  /**
   * DisciplineProgram upsert
   */
  export type DisciplineProgramUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramInclude<ExtArgs> | null
    /**
     * The filter to search for the DisciplineProgram to update in case it exists.
     */
    where: DisciplineProgramWhereUniqueInput
    /**
     * In case the DisciplineProgram found by the `where` argument doesn't exist, create a new DisciplineProgram with this data.
     */
    create: XOR<DisciplineProgramCreateInput, DisciplineProgramUncheckedCreateInput>
    /**
     * In case the DisciplineProgram was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DisciplineProgramUpdateInput, DisciplineProgramUncheckedUpdateInput>
  }

  /**
   * DisciplineProgram delete
   */
  export type DisciplineProgramDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramInclude<ExtArgs> | null
    /**
     * Filter which DisciplineProgram to delete.
     */
    where: DisciplineProgramWhereUniqueInput
  }

  /**
   * DisciplineProgram deleteMany
   */
  export type DisciplineProgramDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DisciplinePrograms to delete
     */
    where?: DisciplineProgramWhereInput
  }

  /**
   * DisciplineProgram.beltRanks
   */
  export type DisciplineProgram$beltRanksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankInclude<ExtArgs> | null
    where?: BeltRankWhereInput
    orderBy?: BeltRankOrderByWithRelationInput | BeltRankOrderByWithRelationInput[]
    cursor?: BeltRankWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BeltRankScalarFieldEnum | BeltRankScalarFieldEnum[]
  }

  /**
   * DisciplineProgram without action
   */
  export type DisciplineProgramDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DisciplineProgram
     */
    select?: DisciplineProgramSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DisciplineProgramInclude<ExtArgs> | null
  }


  /**
   * Model BeltRank
   */

  export type AggregateBeltRank = {
    _count: BeltRankCountAggregateOutputType | null
    _avg: BeltRankAvgAggregateOutputType | null
    _sum: BeltRankSumAggregateOutputType | null
    _min: BeltRankMinAggregateOutputType | null
    _max: BeltRankMaxAggregateOutputType | null
  }

  export type BeltRankAvgAggregateOutputType = {
    order: number | null
    maxStripes: number | null
    minMonthsRequired: number | null
    minHoursRequired: number | null
  }

  export type BeltRankSumAggregateOutputType = {
    order: number | null
    maxStripes: number | null
    minMonthsRequired: number | null
    minHoursRequired: number | null
  }

  export type BeltRankMinAggregateOutputType = {
    id: string | null
    disciplineProgramId: string | null
    name: string | null
    order: number | null
    maxStripes: number | null
    minMonthsRequired: number | null
    minHoursRequired: number | null
  }

  export type BeltRankMaxAggregateOutputType = {
    id: string | null
    disciplineProgramId: string | null
    name: string | null
    order: number | null
    maxStripes: number | null
    minMonthsRequired: number | null
    minHoursRequired: number | null
  }

  export type BeltRankCountAggregateOutputType = {
    id: number
    disciplineProgramId: number
    name: number
    order: number
    maxStripes: number
    minMonthsRequired: number
    minHoursRequired: number
    _all: number
  }


  export type BeltRankAvgAggregateInputType = {
    order?: true
    maxStripes?: true
    minMonthsRequired?: true
    minHoursRequired?: true
  }

  export type BeltRankSumAggregateInputType = {
    order?: true
    maxStripes?: true
    minMonthsRequired?: true
    minHoursRequired?: true
  }

  export type BeltRankMinAggregateInputType = {
    id?: true
    disciplineProgramId?: true
    name?: true
    order?: true
    maxStripes?: true
    minMonthsRequired?: true
    minHoursRequired?: true
  }

  export type BeltRankMaxAggregateInputType = {
    id?: true
    disciplineProgramId?: true
    name?: true
    order?: true
    maxStripes?: true
    minMonthsRequired?: true
    minHoursRequired?: true
  }

  export type BeltRankCountAggregateInputType = {
    id?: true
    disciplineProgramId?: true
    name?: true
    order?: true
    maxStripes?: true
    minMonthsRequired?: true
    minHoursRequired?: true
    _all?: true
  }

  export type BeltRankAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BeltRank to aggregate.
     */
    where?: BeltRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BeltRanks to fetch.
     */
    orderBy?: BeltRankOrderByWithRelationInput | BeltRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BeltRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BeltRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BeltRanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BeltRanks
    **/
    _count?: true | BeltRankCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BeltRankAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BeltRankSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BeltRankMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BeltRankMaxAggregateInputType
  }

  export type GetBeltRankAggregateType<T extends BeltRankAggregateArgs> = {
        [P in keyof T & keyof AggregateBeltRank]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBeltRank[P]>
      : GetScalarType<T[P], AggregateBeltRank[P]>
  }




  export type BeltRankGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BeltRankWhereInput
    orderBy?: BeltRankOrderByWithAggregationInput | BeltRankOrderByWithAggregationInput[]
    by: BeltRankScalarFieldEnum[] | BeltRankScalarFieldEnum
    having?: BeltRankScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BeltRankCountAggregateInputType | true
    _avg?: BeltRankAvgAggregateInputType
    _sum?: BeltRankSumAggregateInputType
    _min?: BeltRankMinAggregateInputType
    _max?: BeltRankMaxAggregateInputType
  }

  export type BeltRankGroupByOutputType = {
    id: string
    disciplineProgramId: string
    name: string
    order: number
    maxStripes: number
    minMonthsRequired: number
    minHoursRequired: number
    _count: BeltRankCountAggregateOutputType | null
    _avg: BeltRankAvgAggregateOutputType | null
    _sum: BeltRankSumAggregateOutputType | null
    _min: BeltRankMinAggregateOutputType | null
    _max: BeltRankMaxAggregateOutputType | null
  }

  type GetBeltRankGroupByPayload<T extends BeltRankGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BeltRankGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BeltRankGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BeltRankGroupByOutputType[P]>
            : GetScalarType<T[P], BeltRankGroupByOutputType[P]>
        }
      >
    >


  export type BeltRankSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    disciplineProgramId?: boolean
    name?: boolean
    order?: boolean
    maxStripes?: boolean
    minMonthsRequired?: boolean
    minHoursRequired?: boolean
    program?: boolean | DisciplineProgramDefaultArgs<ExtArgs>
    studentRanks?: boolean | BeltRank$studentRanksArgs<ExtArgs>
    _count?: boolean | BeltRankCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["beltRank"]>

  export type BeltRankSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    disciplineProgramId?: boolean
    name?: boolean
    order?: boolean
    maxStripes?: boolean
    minMonthsRequired?: boolean
    minHoursRequired?: boolean
    program?: boolean | DisciplineProgramDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["beltRank"]>

  export type BeltRankSelectScalar = {
    id?: boolean
    disciplineProgramId?: boolean
    name?: boolean
    order?: boolean
    maxStripes?: boolean
    minMonthsRequired?: boolean
    minHoursRequired?: boolean
  }

  export type BeltRankInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | DisciplineProgramDefaultArgs<ExtArgs>
    studentRanks?: boolean | BeltRank$studentRanksArgs<ExtArgs>
    _count?: boolean | BeltRankCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BeltRankIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    program?: boolean | DisciplineProgramDefaultArgs<ExtArgs>
  }

  export type $BeltRankPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BeltRank"
    objects: {
      program: Prisma.$DisciplineProgramPayload<ExtArgs>
      studentRanks: Prisma.$StudentRankPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      disciplineProgramId: string
      name: string
      order: number
      maxStripes: number
      minMonthsRequired: number
      minHoursRequired: number
    }, ExtArgs["result"]["beltRank"]>
    composites: {}
  }

  type BeltRankGetPayload<S extends boolean | null | undefined | BeltRankDefaultArgs> = $Result.GetResult<Prisma.$BeltRankPayload, S>

  type BeltRankCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BeltRankFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BeltRankCountAggregateInputType | true
    }

  export interface BeltRankDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BeltRank'], meta: { name: 'BeltRank' } }
    /**
     * Find zero or one BeltRank that matches the filter.
     * @param {BeltRankFindUniqueArgs} args - Arguments to find a BeltRank
     * @example
     * // Get one BeltRank
     * const beltRank = await prisma.beltRank.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BeltRankFindUniqueArgs>(args: SelectSubset<T, BeltRankFindUniqueArgs<ExtArgs>>): Prisma__BeltRankClient<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BeltRank that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BeltRankFindUniqueOrThrowArgs} args - Arguments to find a BeltRank
     * @example
     * // Get one BeltRank
     * const beltRank = await prisma.beltRank.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BeltRankFindUniqueOrThrowArgs>(args: SelectSubset<T, BeltRankFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BeltRankClient<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BeltRank that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeltRankFindFirstArgs} args - Arguments to find a BeltRank
     * @example
     * // Get one BeltRank
     * const beltRank = await prisma.beltRank.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BeltRankFindFirstArgs>(args?: SelectSubset<T, BeltRankFindFirstArgs<ExtArgs>>): Prisma__BeltRankClient<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BeltRank that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeltRankFindFirstOrThrowArgs} args - Arguments to find a BeltRank
     * @example
     * // Get one BeltRank
     * const beltRank = await prisma.beltRank.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BeltRankFindFirstOrThrowArgs>(args?: SelectSubset<T, BeltRankFindFirstOrThrowArgs<ExtArgs>>): Prisma__BeltRankClient<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BeltRanks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeltRankFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BeltRanks
     * const beltRanks = await prisma.beltRank.findMany()
     * 
     * // Get first 10 BeltRanks
     * const beltRanks = await prisma.beltRank.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const beltRankWithIdOnly = await prisma.beltRank.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BeltRankFindManyArgs>(args?: SelectSubset<T, BeltRankFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BeltRank.
     * @param {BeltRankCreateArgs} args - Arguments to create a BeltRank.
     * @example
     * // Create one BeltRank
     * const BeltRank = await prisma.beltRank.create({
     *   data: {
     *     // ... data to create a BeltRank
     *   }
     * })
     * 
     */
    create<T extends BeltRankCreateArgs>(args: SelectSubset<T, BeltRankCreateArgs<ExtArgs>>): Prisma__BeltRankClient<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BeltRanks.
     * @param {BeltRankCreateManyArgs} args - Arguments to create many BeltRanks.
     * @example
     * // Create many BeltRanks
     * const beltRank = await prisma.beltRank.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BeltRankCreateManyArgs>(args?: SelectSubset<T, BeltRankCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BeltRanks and returns the data saved in the database.
     * @param {BeltRankCreateManyAndReturnArgs} args - Arguments to create many BeltRanks.
     * @example
     * // Create many BeltRanks
     * const beltRank = await prisma.beltRank.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BeltRanks and only return the `id`
     * const beltRankWithIdOnly = await prisma.beltRank.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BeltRankCreateManyAndReturnArgs>(args?: SelectSubset<T, BeltRankCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BeltRank.
     * @param {BeltRankDeleteArgs} args - Arguments to delete one BeltRank.
     * @example
     * // Delete one BeltRank
     * const BeltRank = await prisma.beltRank.delete({
     *   where: {
     *     // ... filter to delete one BeltRank
     *   }
     * })
     * 
     */
    delete<T extends BeltRankDeleteArgs>(args: SelectSubset<T, BeltRankDeleteArgs<ExtArgs>>): Prisma__BeltRankClient<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BeltRank.
     * @param {BeltRankUpdateArgs} args - Arguments to update one BeltRank.
     * @example
     * // Update one BeltRank
     * const beltRank = await prisma.beltRank.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BeltRankUpdateArgs>(args: SelectSubset<T, BeltRankUpdateArgs<ExtArgs>>): Prisma__BeltRankClient<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BeltRanks.
     * @param {BeltRankDeleteManyArgs} args - Arguments to filter BeltRanks to delete.
     * @example
     * // Delete a few BeltRanks
     * const { count } = await prisma.beltRank.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BeltRankDeleteManyArgs>(args?: SelectSubset<T, BeltRankDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BeltRanks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeltRankUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BeltRanks
     * const beltRank = await prisma.beltRank.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BeltRankUpdateManyArgs>(args: SelectSubset<T, BeltRankUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BeltRank.
     * @param {BeltRankUpsertArgs} args - Arguments to update or create a BeltRank.
     * @example
     * // Update or create a BeltRank
     * const beltRank = await prisma.beltRank.upsert({
     *   create: {
     *     // ... data to create a BeltRank
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BeltRank we want to update
     *   }
     * })
     */
    upsert<T extends BeltRankUpsertArgs>(args: SelectSubset<T, BeltRankUpsertArgs<ExtArgs>>): Prisma__BeltRankClient<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BeltRanks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeltRankCountArgs} args - Arguments to filter BeltRanks to count.
     * @example
     * // Count the number of BeltRanks
     * const count = await prisma.beltRank.count({
     *   where: {
     *     // ... the filter for the BeltRanks we want to count
     *   }
     * })
    **/
    count<T extends BeltRankCountArgs>(
      args?: Subset<T, BeltRankCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BeltRankCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BeltRank.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeltRankAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BeltRankAggregateArgs>(args: Subset<T, BeltRankAggregateArgs>): Prisma.PrismaPromise<GetBeltRankAggregateType<T>>

    /**
     * Group by BeltRank.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BeltRankGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BeltRankGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BeltRankGroupByArgs['orderBy'] }
        : { orderBy?: BeltRankGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BeltRankGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBeltRankGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BeltRank model
   */
  readonly fields: BeltRankFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BeltRank.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BeltRankClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    program<T extends DisciplineProgramDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DisciplineProgramDefaultArgs<ExtArgs>>): Prisma__DisciplineProgramClient<$Result.GetResult<Prisma.$DisciplineProgramPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    studentRanks<T extends BeltRank$studentRanksArgs<ExtArgs> = {}>(args?: Subset<T, BeltRank$studentRanksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BeltRank model
   */ 
  interface BeltRankFieldRefs {
    readonly id: FieldRef<"BeltRank", 'String'>
    readonly disciplineProgramId: FieldRef<"BeltRank", 'String'>
    readonly name: FieldRef<"BeltRank", 'String'>
    readonly order: FieldRef<"BeltRank", 'Int'>
    readonly maxStripes: FieldRef<"BeltRank", 'Int'>
    readonly minMonthsRequired: FieldRef<"BeltRank", 'Int'>
    readonly minHoursRequired: FieldRef<"BeltRank", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * BeltRank findUnique
   */
  export type BeltRankFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankInclude<ExtArgs> | null
    /**
     * Filter, which BeltRank to fetch.
     */
    where: BeltRankWhereUniqueInput
  }

  /**
   * BeltRank findUniqueOrThrow
   */
  export type BeltRankFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankInclude<ExtArgs> | null
    /**
     * Filter, which BeltRank to fetch.
     */
    where: BeltRankWhereUniqueInput
  }

  /**
   * BeltRank findFirst
   */
  export type BeltRankFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankInclude<ExtArgs> | null
    /**
     * Filter, which BeltRank to fetch.
     */
    where?: BeltRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BeltRanks to fetch.
     */
    orderBy?: BeltRankOrderByWithRelationInput | BeltRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BeltRanks.
     */
    cursor?: BeltRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BeltRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BeltRanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BeltRanks.
     */
    distinct?: BeltRankScalarFieldEnum | BeltRankScalarFieldEnum[]
  }

  /**
   * BeltRank findFirstOrThrow
   */
  export type BeltRankFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankInclude<ExtArgs> | null
    /**
     * Filter, which BeltRank to fetch.
     */
    where?: BeltRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BeltRanks to fetch.
     */
    orderBy?: BeltRankOrderByWithRelationInput | BeltRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BeltRanks.
     */
    cursor?: BeltRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BeltRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BeltRanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BeltRanks.
     */
    distinct?: BeltRankScalarFieldEnum | BeltRankScalarFieldEnum[]
  }

  /**
   * BeltRank findMany
   */
  export type BeltRankFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankInclude<ExtArgs> | null
    /**
     * Filter, which BeltRanks to fetch.
     */
    where?: BeltRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BeltRanks to fetch.
     */
    orderBy?: BeltRankOrderByWithRelationInput | BeltRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BeltRanks.
     */
    cursor?: BeltRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BeltRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BeltRanks.
     */
    skip?: number
    distinct?: BeltRankScalarFieldEnum | BeltRankScalarFieldEnum[]
  }

  /**
   * BeltRank create
   */
  export type BeltRankCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankInclude<ExtArgs> | null
    /**
     * The data needed to create a BeltRank.
     */
    data: XOR<BeltRankCreateInput, BeltRankUncheckedCreateInput>
  }

  /**
   * BeltRank createMany
   */
  export type BeltRankCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BeltRanks.
     */
    data: BeltRankCreateManyInput | BeltRankCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BeltRank createManyAndReturn
   */
  export type BeltRankCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BeltRanks.
     */
    data: BeltRankCreateManyInput | BeltRankCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BeltRank update
   */
  export type BeltRankUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankInclude<ExtArgs> | null
    /**
     * The data needed to update a BeltRank.
     */
    data: XOR<BeltRankUpdateInput, BeltRankUncheckedUpdateInput>
    /**
     * Choose, which BeltRank to update.
     */
    where: BeltRankWhereUniqueInput
  }

  /**
   * BeltRank updateMany
   */
  export type BeltRankUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BeltRanks.
     */
    data: XOR<BeltRankUpdateManyMutationInput, BeltRankUncheckedUpdateManyInput>
    /**
     * Filter which BeltRanks to update
     */
    where?: BeltRankWhereInput
  }

  /**
   * BeltRank upsert
   */
  export type BeltRankUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankInclude<ExtArgs> | null
    /**
     * The filter to search for the BeltRank to update in case it exists.
     */
    where: BeltRankWhereUniqueInput
    /**
     * In case the BeltRank found by the `where` argument doesn't exist, create a new BeltRank with this data.
     */
    create: XOR<BeltRankCreateInput, BeltRankUncheckedCreateInput>
    /**
     * In case the BeltRank was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BeltRankUpdateInput, BeltRankUncheckedUpdateInput>
  }

  /**
   * BeltRank delete
   */
  export type BeltRankDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankInclude<ExtArgs> | null
    /**
     * Filter which BeltRank to delete.
     */
    where: BeltRankWhereUniqueInput
  }

  /**
   * BeltRank deleteMany
   */
  export type BeltRankDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BeltRanks to delete
     */
    where?: BeltRankWhereInput
  }

  /**
   * BeltRank.studentRanks
   */
  export type BeltRank$studentRanksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
    where?: StudentRankWhereInput
    orderBy?: StudentRankOrderByWithRelationInput | StudentRankOrderByWithRelationInput[]
    cursor?: StudentRankWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentRankScalarFieldEnum | StudentRankScalarFieldEnum[]
  }

  /**
   * BeltRank without action
   */
  export type BeltRankDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BeltRank
     */
    select?: BeltRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BeltRankInclude<ExtArgs> | null
  }


  /**
   * Model StudentRank
   */

  export type AggregateStudentRank = {
    _count: StudentRankCountAggregateOutputType | null
    _avg: StudentRankAvgAggregateOutputType | null
    _sum: StudentRankSumAggregateOutputType | null
    _min: StudentRankMinAggregateOutputType | null
    _max: StudentRankMaxAggregateOutputType | null
  }

  export type StudentRankAvgAggregateOutputType = {
    currentStripes: number | null
    accumulatedHours: number | null
  }

  export type StudentRankSumAggregateOutputType = {
    currentStripes: number | null
    accumulatedHours: number | null
  }

  export type StudentRankMinAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    beltRankId: string | null
    currentStripes: number | null
    accumulatedHours: number | null
    promotedAt: Date | null
    lastStripeAt: Date | null
  }

  export type StudentRankMaxAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    beltRankId: string | null
    currentStripes: number | null
    accumulatedHours: number | null
    promotedAt: Date | null
    lastStripeAt: Date | null
  }

  export type StudentRankCountAggregateOutputType = {
    id: number
    studentProfileId: number
    beltRankId: number
    currentStripes: number
    accumulatedHours: number
    promotedAt: number
    lastStripeAt: number
    _all: number
  }


  export type StudentRankAvgAggregateInputType = {
    currentStripes?: true
    accumulatedHours?: true
  }

  export type StudentRankSumAggregateInputType = {
    currentStripes?: true
    accumulatedHours?: true
  }

  export type StudentRankMinAggregateInputType = {
    id?: true
    studentProfileId?: true
    beltRankId?: true
    currentStripes?: true
    accumulatedHours?: true
    promotedAt?: true
    lastStripeAt?: true
  }

  export type StudentRankMaxAggregateInputType = {
    id?: true
    studentProfileId?: true
    beltRankId?: true
    currentStripes?: true
    accumulatedHours?: true
    promotedAt?: true
    lastStripeAt?: true
  }

  export type StudentRankCountAggregateInputType = {
    id?: true
    studentProfileId?: true
    beltRankId?: true
    currentStripes?: true
    accumulatedHours?: true
    promotedAt?: true
    lastStripeAt?: true
    _all?: true
  }

  export type StudentRankAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentRank to aggregate.
     */
    where?: StudentRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentRanks to fetch.
     */
    orderBy?: StudentRankOrderByWithRelationInput | StudentRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentRanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudentRanks
    **/
    _count?: true | StudentRankCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StudentRankAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StudentRankSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentRankMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentRankMaxAggregateInputType
  }

  export type GetStudentRankAggregateType<T extends StudentRankAggregateArgs> = {
        [P in keyof T & keyof AggregateStudentRank]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudentRank[P]>
      : GetScalarType<T[P], AggregateStudentRank[P]>
  }




  export type StudentRankGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentRankWhereInput
    orderBy?: StudentRankOrderByWithAggregationInput | StudentRankOrderByWithAggregationInput[]
    by: StudentRankScalarFieldEnum[] | StudentRankScalarFieldEnum
    having?: StudentRankScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentRankCountAggregateInputType | true
    _avg?: StudentRankAvgAggregateInputType
    _sum?: StudentRankSumAggregateInputType
    _min?: StudentRankMinAggregateInputType
    _max?: StudentRankMaxAggregateInputType
  }

  export type StudentRankGroupByOutputType = {
    id: string
    studentProfileId: string
    beltRankId: string
    currentStripes: number
    accumulatedHours: number
    promotedAt: Date
    lastStripeAt: Date
    _count: StudentRankCountAggregateOutputType | null
    _avg: StudentRankAvgAggregateOutputType | null
    _sum: StudentRankSumAggregateOutputType | null
    _min: StudentRankMinAggregateOutputType | null
    _max: StudentRankMaxAggregateOutputType | null
  }

  type GetStudentRankGroupByPayload<T extends StudentRankGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentRankGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentRankGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentRankGroupByOutputType[P]>
            : GetScalarType<T[P], StudentRankGroupByOutputType[P]>
        }
      >
    >


  export type StudentRankSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    beltRankId?: boolean
    currentStripes?: boolean
    accumulatedHours?: boolean
    promotedAt?: boolean
    lastStripeAt?: boolean
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    beltRank?: boolean | BeltRankDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentRank"]>

  export type StudentRankSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    beltRankId?: boolean
    currentStripes?: boolean
    accumulatedHours?: boolean
    promotedAt?: boolean
    lastStripeAt?: boolean
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    beltRank?: boolean | BeltRankDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentRank"]>

  export type StudentRankSelectScalar = {
    id?: boolean
    studentProfileId?: boolean
    beltRankId?: boolean
    currentStripes?: boolean
    accumulatedHours?: boolean
    promotedAt?: boolean
    lastStripeAt?: boolean
  }

  export type StudentRankInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    beltRank?: boolean | BeltRankDefaultArgs<ExtArgs>
  }
  export type StudentRankIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    beltRank?: boolean | BeltRankDefaultArgs<ExtArgs>
  }

  export type $StudentRankPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentRank"
    objects: {
      student: Prisma.$StudentProfilePayload<ExtArgs>
      beltRank: Prisma.$BeltRankPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentProfileId: string
      beltRankId: string
      currentStripes: number
      accumulatedHours: number
      promotedAt: Date
      lastStripeAt: Date
    }, ExtArgs["result"]["studentRank"]>
    composites: {}
  }

  type StudentRankGetPayload<S extends boolean | null | undefined | StudentRankDefaultArgs> = $Result.GetResult<Prisma.$StudentRankPayload, S>

  type StudentRankCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StudentRankFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StudentRankCountAggregateInputType | true
    }

  export interface StudentRankDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudentRank'], meta: { name: 'StudentRank' } }
    /**
     * Find zero or one StudentRank that matches the filter.
     * @param {StudentRankFindUniqueArgs} args - Arguments to find a StudentRank
     * @example
     * // Get one StudentRank
     * const studentRank = await prisma.studentRank.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentRankFindUniqueArgs>(args: SelectSubset<T, StudentRankFindUniqueArgs<ExtArgs>>): Prisma__StudentRankClient<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StudentRank that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StudentRankFindUniqueOrThrowArgs} args - Arguments to find a StudentRank
     * @example
     * // Get one StudentRank
     * const studentRank = await prisma.studentRank.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentRankFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentRankFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentRankClient<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StudentRank that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRankFindFirstArgs} args - Arguments to find a StudentRank
     * @example
     * // Get one StudentRank
     * const studentRank = await prisma.studentRank.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentRankFindFirstArgs>(args?: SelectSubset<T, StudentRankFindFirstArgs<ExtArgs>>): Prisma__StudentRankClient<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StudentRank that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRankFindFirstOrThrowArgs} args - Arguments to find a StudentRank
     * @example
     * // Get one StudentRank
     * const studentRank = await prisma.studentRank.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentRankFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentRankFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentRankClient<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StudentRanks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRankFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudentRanks
     * const studentRanks = await prisma.studentRank.findMany()
     * 
     * // Get first 10 StudentRanks
     * const studentRanks = await prisma.studentRank.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentRankWithIdOnly = await prisma.studentRank.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentRankFindManyArgs>(args?: SelectSubset<T, StudentRankFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StudentRank.
     * @param {StudentRankCreateArgs} args - Arguments to create a StudentRank.
     * @example
     * // Create one StudentRank
     * const StudentRank = await prisma.studentRank.create({
     *   data: {
     *     // ... data to create a StudentRank
     *   }
     * })
     * 
     */
    create<T extends StudentRankCreateArgs>(args: SelectSubset<T, StudentRankCreateArgs<ExtArgs>>): Prisma__StudentRankClient<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StudentRanks.
     * @param {StudentRankCreateManyArgs} args - Arguments to create many StudentRanks.
     * @example
     * // Create many StudentRanks
     * const studentRank = await prisma.studentRank.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentRankCreateManyArgs>(args?: SelectSubset<T, StudentRankCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudentRanks and returns the data saved in the database.
     * @param {StudentRankCreateManyAndReturnArgs} args - Arguments to create many StudentRanks.
     * @example
     * // Create many StudentRanks
     * const studentRank = await prisma.studentRank.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudentRanks and only return the `id`
     * const studentRankWithIdOnly = await prisma.studentRank.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentRankCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentRankCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StudentRank.
     * @param {StudentRankDeleteArgs} args - Arguments to delete one StudentRank.
     * @example
     * // Delete one StudentRank
     * const StudentRank = await prisma.studentRank.delete({
     *   where: {
     *     // ... filter to delete one StudentRank
     *   }
     * })
     * 
     */
    delete<T extends StudentRankDeleteArgs>(args: SelectSubset<T, StudentRankDeleteArgs<ExtArgs>>): Prisma__StudentRankClient<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StudentRank.
     * @param {StudentRankUpdateArgs} args - Arguments to update one StudentRank.
     * @example
     * // Update one StudentRank
     * const studentRank = await prisma.studentRank.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentRankUpdateArgs>(args: SelectSubset<T, StudentRankUpdateArgs<ExtArgs>>): Prisma__StudentRankClient<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StudentRanks.
     * @param {StudentRankDeleteManyArgs} args - Arguments to filter StudentRanks to delete.
     * @example
     * // Delete a few StudentRanks
     * const { count } = await prisma.studentRank.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentRankDeleteManyArgs>(args?: SelectSubset<T, StudentRankDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentRanks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRankUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudentRanks
     * const studentRank = await prisma.studentRank.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentRankUpdateManyArgs>(args: SelectSubset<T, StudentRankUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StudentRank.
     * @param {StudentRankUpsertArgs} args - Arguments to update or create a StudentRank.
     * @example
     * // Update or create a StudentRank
     * const studentRank = await prisma.studentRank.upsert({
     *   create: {
     *     // ... data to create a StudentRank
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudentRank we want to update
     *   }
     * })
     */
    upsert<T extends StudentRankUpsertArgs>(args: SelectSubset<T, StudentRankUpsertArgs<ExtArgs>>): Prisma__StudentRankClient<$Result.GetResult<Prisma.$StudentRankPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StudentRanks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRankCountArgs} args - Arguments to filter StudentRanks to count.
     * @example
     * // Count the number of StudentRanks
     * const count = await prisma.studentRank.count({
     *   where: {
     *     // ... the filter for the StudentRanks we want to count
     *   }
     * })
    **/
    count<T extends StudentRankCountArgs>(
      args?: Subset<T, StudentRankCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentRankCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudentRank.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRankAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentRankAggregateArgs>(args: Subset<T, StudentRankAggregateArgs>): Prisma.PrismaPromise<GetStudentRankAggregateType<T>>

    /**
     * Group by StudentRank.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentRankGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentRankGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentRankGroupByArgs['orderBy'] }
        : { orderBy?: StudentRankGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentRankGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentRankGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudentRank model
   */
  readonly fields: StudentRankFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudentRank.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentRankClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfileDefaultArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    beltRank<T extends BeltRankDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BeltRankDefaultArgs<ExtArgs>>): Prisma__BeltRankClient<$Result.GetResult<Prisma.$BeltRankPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StudentRank model
   */ 
  interface StudentRankFieldRefs {
    readonly id: FieldRef<"StudentRank", 'String'>
    readonly studentProfileId: FieldRef<"StudentRank", 'String'>
    readonly beltRankId: FieldRef<"StudentRank", 'String'>
    readonly currentStripes: FieldRef<"StudentRank", 'Int'>
    readonly accumulatedHours: FieldRef<"StudentRank", 'Int'>
    readonly promotedAt: FieldRef<"StudentRank", 'DateTime'>
    readonly lastStripeAt: FieldRef<"StudentRank", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StudentRank findUnique
   */
  export type StudentRankFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
    /**
     * Filter, which StudentRank to fetch.
     */
    where: StudentRankWhereUniqueInput
  }

  /**
   * StudentRank findUniqueOrThrow
   */
  export type StudentRankFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
    /**
     * Filter, which StudentRank to fetch.
     */
    where: StudentRankWhereUniqueInput
  }

  /**
   * StudentRank findFirst
   */
  export type StudentRankFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
    /**
     * Filter, which StudentRank to fetch.
     */
    where?: StudentRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentRanks to fetch.
     */
    orderBy?: StudentRankOrderByWithRelationInput | StudentRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentRanks.
     */
    cursor?: StudentRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentRanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentRanks.
     */
    distinct?: StudentRankScalarFieldEnum | StudentRankScalarFieldEnum[]
  }

  /**
   * StudentRank findFirstOrThrow
   */
  export type StudentRankFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
    /**
     * Filter, which StudentRank to fetch.
     */
    where?: StudentRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentRanks to fetch.
     */
    orderBy?: StudentRankOrderByWithRelationInput | StudentRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentRanks.
     */
    cursor?: StudentRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentRanks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentRanks.
     */
    distinct?: StudentRankScalarFieldEnum | StudentRankScalarFieldEnum[]
  }

  /**
   * StudentRank findMany
   */
  export type StudentRankFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
    /**
     * Filter, which StudentRanks to fetch.
     */
    where?: StudentRankWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentRanks to fetch.
     */
    orderBy?: StudentRankOrderByWithRelationInput | StudentRankOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudentRanks.
     */
    cursor?: StudentRankWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentRanks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentRanks.
     */
    skip?: number
    distinct?: StudentRankScalarFieldEnum | StudentRankScalarFieldEnum[]
  }

  /**
   * StudentRank create
   */
  export type StudentRankCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
    /**
     * The data needed to create a StudentRank.
     */
    data: XOR<StudentRankCreateInput, StudentRankUncheckedCreateInput>
  }

  /**
   * StudentRank createMany
   */
  export type StudentRankCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudentRanks.
     */
    data: StudentRankCreateManyInput | StudentRankCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StudentRank createManyAndReturn
   */
  export type StudentRankCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StudentRanks.
     */
    data: StudentRankCreateManyInput | StudentRankCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentRank update
   */
  export type StudentRankUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
    /**
     * The data needed to update a StudentRank.
     */
    data: XOR<StudentRankUpdateInput, StudentRankUncheckedUpdateInput>
    /**
     * Choose, which StudentRank to update.
     */
    where: StudentRankWhereUniqueInput
  }

  /**
   * StudentRank updateMany
   */
  export type StudentRankUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudentRanks.
     */
    data: XOR<StudentRankUpdateManyMutationInput, StudentRankUncheckedUpdateManyInput>
    /**
     * Filter which StudentRanks to update
     */
    where?: StudentRankWhereInput
  }

  /**
   * StudentRank upsert
   */
  export type StudentRankUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
    /**
     * The filter to search for the StudentRank to update in case it exists.
     */
    where: StudentRankWhereUniqueInput
    /**
     * In case the StudentRank found by the `where` argument doesn't exist, create a new StudentRank with this data.
     */
    create: XOR<StudentRankCreateInput, StudentRankUncheckedCreateInput>
    /**
     * In case the StudentRank was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentRankUpdateInput, StudentRankUncheckedUpdateInput>
  }

  /**
   * StudentRank delete
   */
  export type StudentRankDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
    /**
     * Filter which StudentRank to delete.
     */
    where: StudentRankWhereUniqueInput
  }

  /**
   * StudentRank deleteMany
   */
  export type StudentRankDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentRanks to delete
     */
    where?: StudentRankWhereInput
  }

  /**
   * StudentRank without action
   */
  export type StudentRankDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentRank
     */
    select?: StudentRankSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentRankInclude<ExtArgs> | null
  }


  /**
   * Model Attendance
   */

  export type AggregateAttendance = {
    _count: AttendanceCountAggregateOutputType | null
    _min: AttendanceMinAggregateOutputType | null
    _max: AttendanceMaxAggregateOutputType | null
  }

  export type AttendanceMinAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    date: Date | null
    countedForRank: boolean | null
  }

  export type AttendanceMaxAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    date: Date | null
    countedForRank: boolean | null
  }

  export type AttendanceCountAggregateOutputType = {
    id: number
    studentProfileId: number
    date: number
    countedForRank: number
    _all: number
  }


  export type AttendanceMinAggregateInputType = {
    id?: true
    studentProfileId?: true
    date?: true
    countedForRank?: true
  }

  export type AttendanceMaxAggregateInputType = {
    id?: true
    studentProfileId?: true
    date?: true
    countedForRank?: true
  }

  export type AttendanceCountAggregateInputType = {
    id?: true
    studentProfileId?: true
    date?: true
    countedForRank?: true
    _all?: true
  }

  export type AttendanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attendance to aggregate.
     */
    where?: AttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendances to fetch.
     */
    orderBy?: AttendanceOrderByWithRelationInput | AttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Attendances
    **/
    _count?: true | AttendanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AttendanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AttendanceMaxAggregateInputType
  }

  export type GetAttendanceAggregateType<T extends AttendanceAggregateArgs> = {
        [P in keyof T & keyof AggregateAttendance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAttendance[P]>
      : GetScalarType<T[P], AggregateAttendance[P]>
  }




  export type AttendanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttendanceWhereInput
    orderBy?: AttendanceOrderByWithAggregationInput | AttendanceOrderByWithAggregationInput[]
    by: AttendanceScalarFieldEnum[] | AttendanceScalarFieldEnum
    having?: AttendanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AttendanceCountAggregateInputType | true
    _min?: AttendanceMinAggregateInputType
    _max?: AttendanceMaxAggregateInputType
  }

  export type AttendanceGroupByOutputType = {
    id: string
    studentProfileId: string
    date: Date
    countedForRank: boolean
    _count: AttendanceCountAggregateOutputType | null
    _min: AttendanceMinAggregateOutputType | null
    _max: AttendanceMaxAggregateOutputType | null
  }

  type GetAttendanceGroupByPayload<T extends AttendanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AttendanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AttendanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AttendanceGroupByOutputType[P]>
            : GetScalarType<T[P], AttendanceGroupByOutputType[P]>
        }
      >
    >


  export type AttendanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    date?: boolean
    countedForRank?: boolean
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["attendance"]>

  export type AttendanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    date?: boolean
    countedForRank?: boolean
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["attendance"]>

  export type AttendanceSelectScalar = {
    id?: boolean
    studentProfileId?: boolean
    date?: boolean
    countedForRank?: boolean
  }

  export type AttendanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
  }
  export type AttendanceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
  }

  export type $AttendancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Attendance"
    objects: {
      student: Prisma.$StudentProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentProfileId: string
      date: Date
      countedForRank: boolean
    }, ExtArgs["result"]["attendance"]>
    composites: {}
  }

  type AttendanceGetPayload<S extends boolean | null | undefined | AttendanceDefaultArgs> = $Result.GetResult<Prisma.$AttendancePayload, S>

  type AttendanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AttendanceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AttendanceCountAggregateInputType | true
    }

  export interface AttendanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Attendance'], meta: { name: 'Attendance' } }
    /**
     * Find zero or one Attendance that matches the filter.
     * @param {AttendanceFindUniqueArgs} args - Arguments to find a Attendance
     * @example
     * // Get one Attendance
     * const attendance = await prisma.attendance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AttendanceFindUniqueArgs>(args: SelectSubset<T, AttendanceFindUniqueArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Attendance that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AttendanceFindUniqueOrThrowArgs} args - Arguments to find a Attendance
     * @example
     * // Get one Attendance
     * const attendance = await prisma.attendance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AttendanceFindUniqueOrThrowArgs>(args: SelectSubset<T, AttendanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Attendance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceFindFirstArgs} args - Arguments to find a Attendance
     * @example
     * // Get one Attendance
     * const attendance = await prisma.attendance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AttendanceFindFirstArgs>(args?: SelectSubset<T, AttendanceFindFirstArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Attendance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceFindFirstOrThrowArgs} args - Arguments to find a Attendance
     * @example
     * // Get one Attendance
     * const attendance = await prisma.attendance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AttendanceFindFirstOrThrowArgs>(args?: SelectSubset<T, AttendanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Attendances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Attendances
     * const attendances = await prisma.attendance.findMany()
     * 
     * // Get first 10 Attendances
     * const attendances = await prisma.attendance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const attendanceWithIdOnly = await prisma.attendance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AttendanceFindManyArgs>(args?: SelectSubset<T, AttendanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Attendance.
     * @param {AttendanceCreateArgs} args - Arguments to create a Attendance.
     * @example
     * // Create one Attendance
     * const Attendance = await prisma.attendance.create({
     *   data: {
     *     // ... data to create a Attendance
     *   }
     * })
     * 
     */
    create<T extends AttendanceCreateArgs>(args: SelectSubset<T, AttendanceCreateArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Attendances.
     * @param {AttendanceCreateManyArgs} args - Arguments to create many Attendances.
     * @example
     * // Create many Attendances
     * const attendance = await prisma.attendance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AttendanceCreateManyArgs>(args?: SelectSubset<T, AttendanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Attendances and returns the data saved in the database.
     * @param {AttendanceCreateManyAndReturnArgs} args - Arguments to create many Attendances.
     * @example
     * // Create many Attendances
     * const attendance = await prisma.attendance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Attendances and only return the `id`
     * const attendanceWithIdOnly = await prisma.attendance.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AttendanceCreateManyAndReturnArgs>(args?: SelectSubset<T, AttendanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Attendance.
     * @param {AttendanceDeleteArgs} args - Arguments to delete one Attendance.
     * @example
     * // Delete one Attendance
     * const Attendance = await prisma.attendance.delete({
     *   where: {
     *     // ... filter to delete one Attendance
     *   }
     * })
     * 
     */
    delete<T extends AttendanceDeleteArgs>(args: SelectSubset<T, AttendanceDeleteArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Attendance.
     * @param {AttendanceUpdateArgs} args - Arguments to update one Attendance.
     * @example
     * // Update one Attendance
     * const attendance = await prisma.attendance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AttendanceUpdateArgs>(args: SelectSubset<T, AttendanceUpdateArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Attendances.
     * @param {AttendanceDeleteManyArgs} args - Arguments to filter Attendances to delete.
     * @example
     * // Delete a few Attendances
     * const { count } = await prisma.attendance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AttendanceDeleteManyArgs>(args?: SelectSubset<T, AttendanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Attendances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Attendances
     * const attendance = await prisma.attendance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AttendanceUpdateManyArgs>(args: SelectSubset<T, AttendanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Attendance.
     * @param {AttendanceUpsertArgs} args - Arguments to update or create a Attendance.
     * @example
     * // Update or create a Attendance
     * const attendance = await prisma.attendance.upsert({
     *   create: {
     *     // ... data to create a Attendance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Attendance we want to update
     *   }
     * })
     */
    upsert<T extends AttendanceUpsertArgs>(args: SelectSubset<T, AttendanceUpsertArgs<ExtArgs>>): Prisma__AttendanceClient<$Result.GetResult<Prisma.$AttendancePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Attendances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceCountArgs} args - Arguments to filter Attendances to count.
     * @example
     * // Count the number of Attendances
     * const count = await prisma.attendance.count({
     *   where: {
     *     // ... the filter for the Attendances we want to count
     *   }
     * })
    **/
    count<T extends AttendanceCountArgs>(
      args?: Subset<T, AttendanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AttendanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Attendance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AttendanceAggregateArgs>(args: Subset<T, AttendanceAggregateArgs>): Prisma.PrismaPromise<GetAttendanceAggregateType<T>>

    /**
     * Group by Attendance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AttendanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AttendanceGroupByArgs['orderBy'] }
        : { orderBy?: AttendanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AttendanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAttendanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Attendance model
   */
  readonly fields: AttendanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Attendance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AttendanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfileDefaultArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Attendance model
   */ 
  interface AttendanceFieldRefs {
    readonly id: FieldRef<"Attendance", 'String'>
    readonly studentProfileId: FieldRef<"Attendance", 'String'>
    readonly date: FieldRef<"Attendance", 'DateTime'>
    readonly countedForRank: FieldRef<"Attendance", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Attendance findUnique
   */
  export type AttendanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter, which Attendance to fetch.
     */
    where: AttendanceWhereUniqueInput
  }

  /**
   * Attendance findUniqueOrThrow
   */
  export type AttendanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter, which Attendance to fetch.
     */
    where: AttendanceWhereUniqueInput
  }

  /**
   * Attendance findFirst
   */
  export type AttendanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter, which Attendance to fetch.
     */
    where?: AttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendances to fetch.
     */
    orderBy?: AttendanceOrderByWithRelationInput | AttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attendances.
     */
    cursor?: AttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attendances.
     */
    distinct?: AttendanceScalarFieldEnum | AttendanceScalarFieldEnum[]
  }

  /**
   * Attendance findFirstOrThrow
   */
  export type AttendanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter, which Attendance to fetch.
     */
    where?: AttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendances to fetch.
     */
    orderBy?: AttendanceOrderByWithRelationInput | AttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attendances.
     */
    cursor?: AttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attendances.
     */
    distinct?: AttendanceScalarFieldEnum | AttendanceScalarFieldEnum[]
  }

  /**
   * Attendance findMany
   */
  export type AttendanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter, which Attendances to fetch.
     */
    where?: AttendanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attendances to fetch.
     */
    orderBy?: AttendanceOrderByWithRelationInput | AttendanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Attendances.
     */
    cursor?: AttendanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attendances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attendances.
     */
    skip?: number
    distinct?: AttendanceScalarFieldEnum | AttendanceScalarFieldEnum[]
  }

  /**
   * Attendance create
   */
  export type AttendanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * The data needed to create a Attendance.
     */
    data: XOR<AttendanceCreateInput, AttendanceUncheckedCreateInput>
  }

  /**
   * Attendance createMany
   */
  export type AttendanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Attendances.
     */
    data: AttendanceCreateManyInput | AttendanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Attendance createManyAndReturn
   */
  export type AttendanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Attendances.
     */
    data: AttendanceCreateManyInput | AttendanceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Attendance update
   */
  export type AttendanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * The data needed to update a Attendance.
     */
    data: XOR<AttendanceUpdateInput, AttendanceUncheckedUpdateInput>
    /**
     * Choose, which Attendance to update.
     */
    where: AttendanceWhereUniqueInput
  }

  /**
   * Attendance updateMany
   */
  export type AttendanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Attendances.
     */
    data: XOR<AttendanceUpdateManyMutationInput, AttendanceUncheckedUpdateManyInput>
    /**
     * Filter which Attendances to update
     */
    where?: AttendanceWhereInput
  }

  /**
   * Attendance upsert
   */
  export type AttendanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * The filter to search for the Attendance to update in case it exists.
     */
    where: AttendanceWhereUniqueInput
    /**
     * In case the Attendance found by the `where` argument doesn't exist, create a new Attendance with this data.
     */
    create: XOR<AttendanceCreateInput, AttendanceUncheckedCreateInput>
    /**
     * In case the Attendance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AttendanceUpdateInput, AttendanceUncheckedUpdateInput>
  }

  /**
   * Attendance delete
   */
  export type AttendanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
    /**
     * Filter which Attendance to delete.
     */
    where: AttendanceWhereUniqueInput
  }

  /**
   * Attendance deleteMany
   */
  export type AttendanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attendances to delete
     */
    where?: AttendanceWhereInput
  }

  /**
   * Attendance without action
   */
  export type AttendanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attendance
     */
    select?: AttendanceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendanceInclude<ExtArgs> | null
  }


  /**
   * Model ProfileUpdateRequest
   */

  export type AggregateProfileUpdateRequest = {
    _count: ProfileUpdateRequestCountAggregateOutputType | null
    _min: ProfileUpdateRequestMinAggregateOutputType | null
    _max: ProfileUpdateRequestMaxAggregateOutputType | null
  }

  export type ProfileUpdateRequestMinAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    status: $Enums.RequestStatus | null
    reviewedById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileUpdateRequestMaxAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    status: $Enums.RequestStatus | null
    reviewedById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileUpdateRequestCountAggregateOutputType = {
    id: number
    studentProfileId: number
    requestedChanges: number
    status: number
    reviewedById: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProfileUpdateRequestMinAggregateInputType = {
    id?: true
    studentProfileId?: true
    status?: true
    reviewedById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileUpdateRequestMaxAggregateInputType = {
    id?: true
    studentProfileId?: true
    status?: true
    reviewedById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileUpdateRequestCountAggregateInputType = {
    id?: true
    studentProfileId?: true
    requestedChanges?: true
    status?: true
    reviewedById?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProfileUpdateRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileUpdateRequest to aggregate.
     */
    where?: ProfileUpdateRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileUpdateRequests to fetch.
     */
    orderBy?: ProfileUpdateRequestOrderByWithRelationInput | ProfileUpdateRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileUpdateRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileUpdateRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileUpdateRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProfileUpdateRequests
    **/
    _count?: true | ProfileUpdateRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileUpdateRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileUpdateRequestMaxAggregateInputType
  }

  export type GetProfileUpdateRequestAggregateType<T extends ProfileUpdateRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateProfileUpdateRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfileUpdateRequest[P]>
      : GetScalarType<T[P], AggregateProfileUpdateRequest[P]>
  }




  export type ProfileUpdateRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileUpdateRequestWhereInput
    orderBy?: ProfileUpdateRequestOrderByWithAggregationInput | ProfileUpdateRequestOrderByWithAggregationInput[]
    by: ProfileUpdateRequestScalarFieldEnum[] | ProfileUpdateRequestScalarFieldEnum
    having?: ProfileUpdateRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileUpdateRequestCountAggregateInputType | true
    _min?: ProfileUpdateRequestMinAggregateInputType
    _max?: ProfileUpdateRequestMaxAggregateInputType
  }

  export type ProfileUpdateRequestGroupByOutputType = {
    id: string
    studentProfileId: string
    requestedChanges: JsonValue
    status: $Enums.RequestStatus
    reviewedById: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProfileUpdateRequestCountAggregateOutputType | null
    _min: ProfileUpdateRequestMinAggregateOutputType | null
    _max: ProfileUpdateRequestMaxAggregateOutputType | null
  }

  type GetProfileUpdateRequestGroupByPayload<T extends ProfileUpdateRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileUpdateRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileUpdateRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileUpdateRequestGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileUpdateRequestGroupByOutputType[P]>
        }
      >
    >


  export type ProfileUpdateRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    requestedChanges?: boolean
    status?: boolean
    reviewedById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    studentProfile?: boolean | StudentProfileDefaultArgs<ExtArgs>
    reviewer?: boolean | ProfileUpdateRequest$reviewerArgs<ExtArgs>
  }, ExtArgs["result"]["profileUpdateRequest"]>

  export type ProfileUpdateRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    requestedChanges?: boolean
    status?: boolean
    reviewedById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    studentProfile?: boolean | StudentProfileDefaultArgs<ExtArgs>
    reviewer?: boolean | ProfileUpdateRequest$reviewerArgs<ExtArgs>
  }, ExtArgs["result"]["profileUpdateRequest"]>

  export type ProfileUpdateRequestSelectScalar = {
    id?: boolean
    studentProfileId?: boolean
    requestedChanges?: boolean
    status?: boolean
    reviewedById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProfileUpdateRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studentProfile?: boolean | StudentProfileDefaultArgs<ExtArgs>
    reviewer?: boolean | ProfileUpdateRequest$reviewerArgs<ExtArgs>
  }
  export type ProfileUpdateRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studentProfile?: boolean | StudentProfileDefaultArgs<ExtArgs>
    reviewer?: boolean | ProfileUpdateRequest$reviewerArgs<ExtArgs>
  }

  export type $ProfileUpdateRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProfileUpdateRequest"
    objects: {
      studentProfile: Prisma.$StudentProfilePayload<ExtArgs>
      reviewer: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentProfileId: string
      requestedChanges: Prisma.JsonValue
      status: $Enums.RequestStatus
      reviewedById: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["profileUpdateRequest"]>
    composites: {}
  }

  type ProfileUpdateRequestGetPayload<S extends boolean | null | undefined | ProfileUpdateRequestDefaultArgs> = $Result.GetResult<Prisma.$ProfileUpdateRequestPayload, S>

  type ProfileUpdateRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProfileUpdateRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProfileUpdateRequestCountAggregateInputType | true
    }

  export interface ProfileUpdateRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProfileUpdateRequest'], meta: { name: 'ProfileUpdateRequest' } }
    /**
     * Find zero or one ProfileUpdateRequest that matches the filter.
     * @param {ProfileUpdateRequestFindUniqueArgs} args - Arguments to find a ProfileUpdateRequest
     * @example
     * // Get one ProfileUpdateRequest
     * const profileUpdateRequest = await prisma.profileUpdateRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileUpdateRequestFindUniqueArgs>(args: SelectSubset<T, ProfileUpdateRequestFindUniqueArgs<ExtArgs>>): Prisma__ProfileUpdateRequestClient<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProfileUpdateRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProfileUpdateRequestFindUniqueOrThrowArgs} args - Arguments to find a ProfileUpdateRequest
     * @example
     * // Get one ProfileUpdateRequest
     * const profileUpdateRequest = await prisma.profileUpdateRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileUpdateRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileUpdateRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileUpdateRequestClient<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProfileUpdateRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateRequestFindFirstArgs} args - Arguments to find a ProfileUpdateRequest
     * @example
     * // Get one ProfileUpdateRequest
     * const profileUpdateRequest = await prisma.profileUpdateRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileUpdateRequestFindFirstArgs>(args?: SelectSubset<T, ProfileUpdateRequestFindFirstArgs<ExtArgs>>): Prisma__ProfileUpdateRequestClient<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProfileUpdateRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateRequestFindFirstOrThrowArgs} args - Arguments to find a ProfileUpdateRequest
     * @example
     * // Get one ProfileUpdateRequest
     * const profileUpdateRequest = await prisma.profileUpdateRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileUpdateRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileUpdateRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileUpdateRequestClient<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProfileUpdateRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfileUpdateRequests
     * const profileUpdateRequests = await prisma.profileUpdateRequest.findMany()
     * 
     * // Get first 10 ProfileUpdateRequests
     * const profileUpdateRequests = await prisma.profileUpdateRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileUpdateRequestWithIdOnly = await prisma.profileUpdateRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileUpdateRequestFindManyArgs>(args?: SelectSubset<T, ProfileUpdateRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProfileUpdateRequest.
     * @param {ProfileUpdateRequestCreateArgs} args - Arguments to create a ProfileUpdateRequest.
     * @example
     * // Create one ProfileUpdateRequest
     * const ProfileUpdateRequest = await prisma.profileUpdateRequest.create({
     *   data: {
     *     // ... data to create a ProfileUpdateRequest
     *   }
     * })
     * 
     */
    create<T extends ProfileUpdateRequestCreateArgs>(args: SelectSubset<T, ProfileUpdateRequestCreateArgs<ExtArgs>>): Prisma__ProfileUpdateRequestClient<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProfileUpdateRequests.
     * @param {ProfileUpdateRequestCreateManyArgs} args - Arguments to create many ProfileUpdateRequests.
     * @example
     * // Create many ProfileUpdateRequests
     * const profileUpdateRequest = await prisma.profileUpdateRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileUpdateRequestCreateManyArgs>(args?: SelectSubset<T, ProfileUpdateRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProfileUpdateRequests and returns the data saved in the database.
     * @param {ProfileUpdateRequestCreateManyAndReturnArgs} args - Arguments to create many ProfileUpdateRequests.
     * @example
     * // Create many ProfileUpdateRequests
     * const profileUpdateRequest = await prisma.profileUpdateRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProfileUpdateRequests and only return the `id`
     * const profileUpdateRequestWithIdOnly = await prisma.profileUpdateRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileUpdateRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileUpdateRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProfileUpdateRequest.
     * @param {ProfileUpdateRequestDeleteArgs} args - Arguments to delete one ProfileUpdateRequest.
     * @example
     * // Delete one ProfileUpdateRequest
     * const ProfileUpdateRequest = await prisma.profileUpdateRequest.delete({
     *   where: {
     *     // ... filter to delete one ProfileUpdateRequest
     *   }
     * })
     * 
     */
    delete<T extends ProfileUpdateRequestDeleteArgs>(args: SelectSubset<T, ProfileUpdateRequestDeleteArgs<ExtArgs>>): Prisma__ProfileUpdateRequestClient<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProfileUpdateRequest.
     * @param {ProfileUpdateRequestUpdateArgs} args - Arguments to update one ProfileUpdateRequest.
     * @example
     * // Update one ProfileUpdateRequest
     * const profileUpdateRequest = await prisma.profileUpdateRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileUpdateRequestUpdateArgs>(args: SelectSubset<T, ProfileUpdateRequestUpdateArgs<ExtArgs>>): Prisma__ProfileUpdateRequestClient<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProfileUpdateRequests.
     * @param {ProfileUpdateRequestDeleteManyArgs} args - Arguments to filter ProfileUpdateRequests to delete.
     * @example
     * // Delete a few ProfileUpdateRequests
     * const { count } = await prisma.profileUpdateRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileUpdateRequestDeleteManyArgs>(args?: SelectSubset<T, ProfileUpdateRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfileUpdateRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfileUpdateRequests
     * const profileUpdateRequest = await prisma.profileUpdateRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileUpdateRequestUpdateManyArgs>(args: SelectSubset<T, ProfileUpdateRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProfileUpdateRequest.
     * @param {ProfileUpdateRequestUpsertArgs} args - Arguments to update or create a ProfileUpdateRequest.
     * @example
     * // Update or create a ProfileUpdateRequest
     * const profileUpdateRequest = await prisma.profileUpdateRequest.upsert({
     *   create: {
     *     // ... data to create a ProfileUpdateRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfileUpdateRequest we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpdateRequestUpsertArgs>(args: SelectSubset<T, ProfileUpdateRequestUpsertArgs<ExtArgs>>): Prisma__ProfileUpdateRequestClient<$Result.GetResult<Prisma.$ProfileUpdateRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProfileUpdateRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateRequestCountArgs} args - Arguments to filter ProfileUpdateRequests to count.
     * @example
     * // Count the number of ProfileUpdateRequests
     * const count = await prisma.profileUpdateRequest.count({
     *   where: {
     *     // ... the filter for the ProfileUpdateRequests we want to count
     *   }
     * })
    **/
    count<T extends ProfileUpdateRequestCountArgs>(
      args?: Subset<T, ProfileUpdateRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileUpdateRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfileUpdateRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfileUpdateRequestAggregateArgs>(args: Subset<T, ProfileUpdateRequestAggregateArgs>): Prisma.PrismaPromise<GetProfileUpdateRequestAggregateType<T>>

    /**
     * Group by ProfileUpdateRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfileUpdateRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileUpdateRequestGroupByArgs['orderBy'] }
        : { orderBy?: ProfileUpdateRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfileUpdateRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileUpdateRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProfileUpdateRequest model
   */
  readonly fields: ProfileUpdateRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfileUpdateRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileUpdateRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    studentProfile<T extends StudentProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfileDefaultArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    reviewer<T extends ProfileUpdateRequest$reviewerArgs<ExtArgs> = {}>(args?: Subset<T, ProfileUpdateRequest$reviewerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProfileUpdateRequest model
   */ 
  interface ProfileUpdateRequestFieldRefs {
    readonly id: FieldRef<"ProfileUpdateRequest", 'String'>
    readonly studentProfileId: FieldRef<"ProfileUpdateRequest", 'String'>
    readonly requestedChanges: FieldRef<"ProfileUpdateRequest", 'Json'>
    readonly status: FieldRef<"ProfileUpdateRequest", 'RequestStatus'>
    readonly reviewedById: FieldRef<"ProfileUpdateRequest", 'String'>
    readonly createdAt: FieldRef<"ProfileUpdateRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"ProfileUpdateRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProfileUpdateRequest findUnique
   */
  export type ProfileUpdateRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
    /**
     * Filter, which ProfileUpdateRequest to fetch.
     */
    where: ProfileUpdateRequestWhereUniqueInput
  }

  /**
   * ProfileUpdateRequest findUniqueOrThrow
   */
  export type ProfileUpdateRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
    /**
     * Filter, which ProfileUpdateRequest to fetch.
     */
    where: ProfileUpdateRequestWhereUniqueInput
  }

  /**
   * ProfileUpdateRequest findFirst
   */
  export type ProfileUpdateRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
    /**
     * Filter, which ProfileUpdateRequest to fetch.
     */
    where?: ProfileUpdateRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileUpdateRequests to fetch.
     */
    orderBy?: ProfileUpdateRequestOrderByWithRelationInput | ProfileUpdateRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileUpdateRequests.
     */
    cursor?: ProfileUpdateRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileUpdateRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileUpdateRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileUpdateRequests.
     */
    distinct?: ProfileUpdateRequestScalarFieldEnum | ProfileUpdateRequestScalarFieldEnum[]
  }

  /**
   * ProfileUpdateRequest findFirstOrThrow
   */
  export type ProfileUpdateRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
    /**
     * Filter, which ProfileUpdateRequest to fetch.
     */
    where?: ProfileUpdateRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileUpdateRequests to fetch.
     */
    orderBy?: ProfileUpdateRequestOrderByWithRelationInput | ProfileUpdateRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfileUpdateRequests.
     */
    cursor?: ProfileUpdateRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileUpdateRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileUpdateRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfileUpdateRequests.
     */
    distinct?: ProfileUpdateRequestScalarFieldEnum | ProfileUpdateRequestScalarFieldEnum[]
  }

  /**
   * ProfileUpdateRequest findMany
   */
  export type ProfileUpdateRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
    /**
     * Filter, which ProfileUpdateRequests to fetch.
     */
    where?: ProfileUpdateRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfileUpdateRequests to fetch.
     */
    orderBy?: ProfileUpdateRequestOrderByWithRelationInput | ProfileUpdateRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProfileUpdateRequests.
     */
    cursor?: ProfileUpdateRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfileUpdateRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfileUpdateRequests.
     */
    skip?: number
    distinct?: ProfileUpdateRequestScalarFieldEnum | ProfileUpdateRequestScalarFieldEnum[]
  }

  /**
   * ProfileUpdateRequest create
   */
  export type ProfileUpdateRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a ProfileUpdateRequest.
     */
    data: XOR<ProfileUpdateRequestCreateInput, ProfileUpdateRequestUncheckedCreateInput>
  }

  /**
   * ProfileUpdateRequest createMany
   */
  export type ProfileUpdateRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProfileUpdateRequests.
     */
    data: ProfileUpdateRequestCreateManyInput | ProfileUpdateRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfileUpdateRequest createManyAndReturn
   */
  export type ProfileUpdateRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProfileUpdateRequests.
     */
    data: ProfileUpdateRequestCreateManyInput | ProfileUpdateRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProfileUpdateRequest update
   */
  export type ProfileUpdateRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a ProfileUpdateRequest.
     */
    data: XOR<ProfileUpdateRequestUpdateInput, ProfileUpdateRequestUncheckedUpdateInput>
    /**
     * Choose, which ProfileUpdateRequest to update.
     */
    where: ProfileUpdateRequestWhereUniqueInput
  }

  /**
   * ProfileUpdateRequest updateMany
   */
  export type ProfileUpdateRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProfileUpdateRequests.
     */
    data: XOR<ProfileUpdateRequestUpdateManyMutationInput, ProfileUpdateRequestUncheckedUpdateManyInput>
    /**
     * Filter which ProfileUpdateRequests to update
     */
    where?: ProfileUpdateRequestWhereInput
  }

  /**
   * ProfileUpdateRequest upsert
   */
  export type ProfileUpdateRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the ProfileUpdateRequest to update in case it exists.
     */
    where: ProfileUpdateRequestWhereUniqueInput
    /**
     * In case the ProfileUpdateRequest found by the `where` argument doesn't exist, create a new ProfileUpdateRequest with this data.
     */
    create: XOR<ProfileUpdateRequestCreateInput, ProfileUpdateRequestUncheckedCreateInput>
    /**
     * In case the ProfileUpdateRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateRequestUpdateInput, ProfileUpdateRequestUncheckedUpdateInput>
  }

  /**
   * ProfileUpdateRequest delete
   */
  export type ProfileUpdateRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
    /**
     * Filter which ProfileUpdateRequest to delete.
     */
    where: ProfileUpdateRequestWhereUniqueInput
  }

  /**
   * ProfileUpdateRequest deleteMany
   */
  export type ProfileUpdateRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfileUpdateRequests to delete
     */
    where?: ProfileUpdateRequestWhereInput
  }

  /**
   * ProfileUpdateRequest.reviewer
   */
  export type ProfileUpdateRequest$reviewerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ProfileUpdateRequest without action
   */
  export type ProfileUpdateRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileUpdateRequest
     */
    select?: ProfileUpdateRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileUpdateRequestInclude<ExtArgs> | null
  }


  /**
   * Model PromotionRequest
   */

  export type AggregatePromotionRequest = {
    _count: PromotionRequestCountAggregateOutputType | null
    _avg: PromotionRequestAvgAggregateOutputType | null
    _sum: PromotionRequestSumAggregateOutputType | null
    _min: PromotionRequestMinAggregateOutputType | null
    _max: PromotionRequestMaxAggregateOutputType | null
  }

  export type PromotionRequestAvgAggregateOutputType = {
    proposedStripes: number | null
  }

  export type PromotionRequestSumAggregateOutputType = {
    proposedStripes: number | null
  }

  export type PromotionRequestMinAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    proposedBeltId: string | null
    proposedStripes: number | null
    proposedById: string | null
    approvedById: string | null
    status: $Enums.RequestStatus | null
    createdAt: Date | null
  }

  export type PromotionRequestMaxAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    proposedBeltId: string | null
    proposedStripes: number | null
    proposedById: string | null
    approvedById: string | null
    status: $Enums.RequestStatus | null
    createdAt: Date | null
  }

  export type PromotionRequestCountAggregateOutputType = {
    id: number
    studentProfileId: number
    proposedBeltId: number
    proposedStripes: number
    proposedById: number
    approvedById: number
    status: number
    createdAt: number
    _all: number
  }


  export type PromotionRequestAvgAggregateInputType = {
    proposedStripes?: true
  }

  export type PromotionRequestSumAggregateInputType = {
    proposedStripes?: true
  }

  export type PromotionRequestMinAggregateInputType = {
    id?: true
    studentProfileId?: true
    proposedBeltId?: true
    proposedStripes?: true
    proposedById?: true
    approvedById?: true
    status?: true
    createdAt?: true
  }

  export type PromotionRequestMaxAggregateInputType = {
    id?: true
    studentProfileId?: true
    proposedBeltId?: true
    proposedStripes?: true
    proposedById?: true
    approvedById?: true
    status?: true
    createdAt?: true
  }

  export type PromotionRequestCountAggregateInputType = {
    id?: true
    studentProfileId?: true
    proposedBeltId?: true
    proposedStripes?: true
    proposedById?: true
    approvedById?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type PromotionRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PromotionRequest to aggregate.
     */
    where?: PromotionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromotionRequests to fetch.
     */
    orderBy?: PromotionRequestOrderByWithRelationInput | PromotionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PromotionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromotionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromotionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PromotionRequests
    **/
    _count?: true | PromotionRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PromotionRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PromotionRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PromotionRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PromotionRequestMaxAggregateInputType
  }

  export type GetPromotionRequestAggregateType<T extends PromotionRequestAggregateArgs> = {
        [P in keyof T & keyof AggregatePromotionRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePromotionRequest[P]>
      : GetScalarType<T[P], AggregatePromotionRequest[P]>
  }




  export type PromotionRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromotionRequestWhereInput
    orderBy?: PromotionRequestOrderByWithAggregationInput | PromotionRequestOrderByWithAggregationInput[]
    by: PromotionRequestScalarFieldEnum[] | PromotionRequestScalarFieldEnum
    having?: PromotionRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PromotionRequestCountAggregateInputType | true
    _avg?: PromotionRequestAvgAggregateInputType
    _sum?: PromotionRequestSumAggregateInputType
    _min?: PromotionRequestMinAggregateInputType
    _max?: PromotionRequestMaxAggregateInputType
  }

  export type PromotionRequestGroupByOutputType = {
    id: string
    studentProfileId: string
    proposedBeltId: string | null
    proposedStripes: number | null
    proposedById: string
    approvedById: string | null
    status: $Enums.RequestStatus
    createdAt: Date
    _count: PromotionRequestCountAggregateOutputType | null
    _avg: PromotionRequestAvgAggregateOutputType | null
    _sum: PromotionRequestSumAggregateOutputType | null
    _min: PromotionRequestMinAggregateOutputType | null
    _max: PromotionRequestMaxAggregateOutputType | null
  }

  type GetPromotionRequestGroupByPayload<T extends PromotionRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PromotionRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PromotionRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PromotionRequestGroupByOutputType[P]>
            : GetScalarType<T[P], PromotionRequestGroupByOutputType[P]>
        }
      >
    >


  export type PromotionRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    proposedBeltId?: boolean
    proposedStripes?: boolean
    proposedById?: boolean
    approvedById?: boolean
    status?: boolean
    createdAt?: boolean
    studentProfile?: boolean | StudentProfileDefaultArgs<ExtArgs>
    proposedBy?: boolean | UserDefaultArgs<ExtArgs>
    approvedBy?: boolean | PromotionRequest$approvedByArgs<ExtArgs>
  }, ExtArgs["result"]["promotionRequest"]>

  export type PromotionRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    proposedBeltId?: boolean
    proposedStripes?: boolean
    proposedById?: boolean
    approvedById?: boolean
    status?: boolean
    createdAt?: boolean
    studentProfile?: boolean | StudentProfileDefaultArgs<ExtArgs>
    proposedBy?: boolean | UserDefaultArgs<ExtArgs>
    approvedBy?: boolean | PromotionRequest$approvedByArgs<ExtArgs>
  }, ExtArgs["result"]["promotionRequest"]>

  export type PromotionRequestSelectScalar = {
    id?: boolean
    studentProfileId?: boolean
    proposedBeltId?: boolean
    proposedStripes?: boolean
    proposedById?: boolean
    approvedById?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type PromotionRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studentProfile?: boolean | StudentProfileDefaultArgs<ExtArgs>
    proposedBy?: boolean | UserDefaultArgs<ExtArgs>
    approvedBy?: boolean | PromotionRequest$approvedByArgs<ExtArgs>
  }
  export type PromotionRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    studentProfile?: boolean | StudentProfileDefaultArgs<ExtArgs>
    proposedBy?: boolean | UserDefaultArgs<ExtArgs>
    approvedBy?: boolean | PromotionRequest$approvedByArgs<ExtArgs>
  }

  export type $PromotionRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PromotionRequest"
    objects: {
      studentProfile: Prisma.$StudentProfilePayload<ExtArgs>
      proposedBy: Prisma.$UserPayload<ExtArgs>
      approvedBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentProfileId: string
      proposedBeltId: string | null
      proposedStripes: number | null
      proposedById: string
      approvedById: string | null
      status: $Enums.RequestStatus
      createdAt: Date
    }, ExtArgs["result"]["promotionRequest"]>
    composites: {}
  }

  type PromotionRequestGetPayload<S extends boolean | null | undefined | PromotionRequestDefaultArgs> = $Result.GetResult<Prisma.$PromotionRequestPayload, S>

  type PromotionRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PromotionRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PromotionRequestCountAggregateInputType | true
    }

  export interface PromotionRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PromotionRequest'], meta: { name: 'PromotionRequest' } }
    /**
     * Find zero or one PromotionRequest that matches the filter.
     * @param {PromotionRequestFindUniqueArgs} args - Arguments to find a PromotionRequest
     * @example
     * // Get one PromotionRequest
     * const promotionRequest = await prisma.promotionRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PromotionRequestFindUniqueArgs>(args: SelectSubset<T, PromotionRequestFindUniqueArgs<ExtArgs>>): Prisma__PromotionRequestClient<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PromotionRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PromotionRequestFindUniqueOrThrowArgs} args - Arguments to find a PromotionRequest
     * @example
     * // Get one PromotionRequest
     * const promotionRequest = await prisma.promotionRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PromotionRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, PromotionRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PromotionRequestClient<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PromotionRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionRequestFindFirstArgs} args - Arguments to find a PromotionRequest
     * @example
     * // Get one PromotionRequest
     * const promotionRequest = await prisma.promotionRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PromotionRequestFindFirstArgs>(args?: SelectSubset<T, PromotionRequestFindFirstArgs<ExtArgs>>): Prisma__PromotionRequestClient<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PromotionRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionRequestFindFirstOrThrowArgs} args - Arguments to find a PromotionRequest
     * @example
     * // Get one PromotionRequest
     * const promotionRequest = await prisma.promotionRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PromotionRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, PromotionRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__PromotionRequestClient<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PromotionRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PromotionRequests
     * const promotionRequests = await prisma.promotionRequest.findMany()
     * 
     * // Get first 10 PromotionRequests
     * const promotionRequests = await prisma.promotionRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const promotionRequestWithIdOnly = await prisma.promotionRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PromotionRequestFindManyArgs>(args?: SelectSubset<T, PromotionRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PromotionRequest.
     * @param {PromotionRequestCreateArgs} args - Arguments to create a PromotionRequest.
     * @example
     * // Create one PromotionRequest
     * const PromotionRequest = await prisma.promotionRequest.create({
     *   data: {
     *     // ... data to create a PromotionRequest
     *   }
     * })
     * 
     */
    create<T extends PromotionRequestCreateArgs>(args: SelectSubset<T, PromotionRequestCreateArgs<ExtArgs>>): Prisma__PromotionRequestClient<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PromotionRequests.
     * @param {PromotionRequestCreateManyArgs} args - Arguments to create many PromotionRequests.
     * @example
     * // Create many PromotionRequests
     * const promotionRequest = await prisma.promotionRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PromotionRequestCreateManyArgs>(args?: SelectSubset<T, PromotionRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PromotionRequests and returns the data saved in the database.
     * @param {PromotionRequestCreateManyAndReturnArgs} args - Arguments to create many PromotionRequests.
     * @example
     * // Create many PromotionRequests
     * const promotionRequest = await prisma.promotionRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PromotionRequests and only return the `id`
     * const promotionRequestWithIdOnly = await prisma.promotionRequest.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PromotionRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, PromotionRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PromotionRequest.
     * @param {PromotionRequestDeleteArgs} args - Arguments to delete one PromotionRequest.
     * @example
     * // Delete one PromotionRequest
     * const PromotionRequest = await prisma.promotionRequest.delete({
     *   where: {
     *     // ... filter to delete one PromotionRequest
     *   }
     * })
     * 
     */
    delete<T extends PromotionRequestDeleteArgs>(args: SelectSubset<T, PromotionRequestDeleteArgs<ExtArgs>>): Prisma__PromotionRequestClient<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PromotionRequest.
     * @param {PromotionRequestUpdateArgs} args - Arguments to update one PromotionRequest.
     * @example
     * // Update one PromotionRequest
     * const promotionRequest = await prisma.promotionRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PromotionRequestUpdateArgs>(args: SelectSubset<T, PromotionRequestUpdateArgs<ExtArgs>>): Prisma__PromotionRequestClient<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PromotionRequests.
     * @param {PromotionRequestDeleteManyArgs} args - Arguments to filter PromotionRequests to delete.
     * @example
     * // Delete a few PromotionRequests
     * const { count } = await prisma.promotionRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PromotionRequestDeleteManyArgs>(args?: SelectSubset<T, PromotionRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PromotionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PromotionRequests
     * const promotionRequest = await prisma.promotionRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PromotionRequestUpdateManyArgs>(args: SelectSubset<T, PromotionRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PromotionRequest.
     * @param {PromotionRequestUpsertArgs} args - Arguments to update or create a PromotionRequest.
     * @example
     * // Update or create a PromotionRequest
     * const promotionRequest = await prisma.promotionRequest.upsert({
     *   create: {
     *     // ... data to create a PromotionRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PromotionRequest we want to update
     *   }
     * })
     */
    upsert<T extends PromotionRequestUpsertArgs>(args: SelectSubset<T, PromotionRequestUpsertArgs<ExtArgs>>): Prisma__PromotionRequestClient<$Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PromotionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionRequestCountArgs} args - Arguments to filter PromotionRequests to count.
     * @example
     * // Count the number of PromotionRequests
     * const count = await prisma.promotionRequest.count({
     *   where: {
     *     // ... the filter for the PromotionRequests we want to count
     *   }
     * })
    **/
    count<T extends PromotionRequestCountArgs>(
      args?: Subset<T, PromotionRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PromotionRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PromotionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PromotionRequestAggregateArgs>(args: Subset<T, PromotionRequestAggregateArgs>): Prisma.PrismaPromise<GetPromotionRequestAggregateType<T>>

    /**
     * Group by PromotionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PromotionRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PromotionRequestGroupByArgs['orderBy'] }
        : { orderBy?: PromotionRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PromotionRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromotionRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PromotionRequest model
   */
  readonly fields: PromotionRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PromotionRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PromotionRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    studentProfile<T extends StudentProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfileDefaultArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    proposedBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    approvedBy<T extends PromotionRequest$approvedByArgs<ExtArgs> = {}>(args?: Subset<T, PromotionRequest$approvedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PromotionRequest model
   */ 
  interface PromotionRequestFieldRefs {
    readonly id: FieldRef<"PromotionRequest", 'String'>
    readonly studentProfileId: FieldRef<"PromotionRequest", 'String'>
    readonly proposedBeltId: FieldRef<"PromotionRequest", 'String'>
    readonly proposedStripes: FieldRef<"PromotionRequest", 'Int'>
    readonly proposedById: FieldRef<"PromotionRequest", 'String'>
    readonly approvedById: FieldRef<"PromotionRequest", 'String'>
    readonly status: FieldRef<"PromotionRequest", 'RequestStatus'>
    readonly createdAt: FieldRef<"PromotionRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PromotionRequest findUnique
   */
  export type PromotionRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    /**
     * Filter, which PromotionRequest to fetch.
     */
    where: PromotionRequestWhereUniqueInput
  }

  /**
   * PromotionRequest findUniqueOrThrow
   */
  export type PromotionRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    /**
     * Filter, which PromotionRequest to fetch.
     */
    where: PromotionRequestWhereUniqueInput
  }

  /**
   * PromotionRequest findFirst
   */
  export type PromotionRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    /**
     * Filter, which PromotionRequest to fetch.
     */
    where?: PromotionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromotionRequests to fetch.
     */
    orderBy?: PromotionRequestOrderByWithRelationInput | PromotionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PromotionRequests.
     */
    cursor?: PromotionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromotionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromotionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PromotionRequests.
     */
    distinct?: PromotionRequestScalarFieldEnum | PromotionRequestScalarFieldEnum[]
  }

  /**
   * PromotionRequest findFirstOrThrow
   */
  export type PromotionRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    /**
     * Filter, which PromotionRequest to fetch.
     */
    where?: PromotionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromotionRequests to fetch.
     */
    orderBy?: PromotionRequestOrderByWithRelationInput | PromotionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PromotionRequests.
     */
    cursor?: PromotionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromotionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromotionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PromotionRequests.
     */
    distinct?: PromotionRequestScalarFieldEnum | PromotionRequestScalarFieldEnum[]
  }

  /**
   * PromotionRequest findMany
   */
  export type PromotionRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    /**
     * Filter, which PromotionRequests to fetch.
     */
    where?: PromotionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromotionRequests to fetch.
     */
    orderBy?: PromotionRequestOrderByWithRelationInput | PromotionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PromotionRequests.
     */
    cursor?: PromotionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromotionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromotionRequests.
     */
    skip?: number
    distinct?: PromotionRequestScalarFieldEnum | PromotionRequestScalarFieldEnum[]
  }

  /**
   * PromotionRequest create
   */
  export type PromotionRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a PromotionRequest.
     */
    data: XOR<PromotionRequestCreateInput, PromotionRequestUncheckedCreateInput>
  }

  /**
   * PromotionRequest createMany
   */
  export type PromotionRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PromotionRequests.
     */
    data: PromotionRequestCreateManyInput | PromotionRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PromotionRequest createManyAndReturn
   */
  export type PromotionRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PromotionRequests.
     */
    data: PromotionRequestCreateManyInput | PromotionRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PromotionRequest update
   */
  export type PromotionRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a PromotionRequest.
     */
    data: XOR<PromotionRequestUpdateInput, PromotionRequestUncheckedUpdateInput>
    /**
     * Choose, which PromotionRequest to update.
     */
    where: PromotionRequestWhereUniqueInput
  }

  /**
   * PromotionRequest updateMany
   */
  export type PromotionRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PromotionRequests.
     */
    data: XOR<PromotionRequestUpdateManyMutationInput, PromotionRequestUncheckedUpdateManyInput>
    /**
     * Filter which PromotionRequests to update
     */
    where?: PromotionRequestWhereInput
  }

  /**
   * PromotionRequest upsert
   */
  export type PromotionRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the PromotionRequest to update in case it exists.
     */
    where: PromotionRequestWhereUniqueInput
    /**
     * In case the PromotionRequest found by the `where` argument doesn't exist, create a new PromotionRequest with this data.
     */
    create: XOR<PromotionRequestCreateInput, PromotionRequestUncheckedCreateInput>
    /**
     * In case the PromotionRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PromotionRequestUpdateInput, PromotionRequestUncheckedUpdateInput>
  }

  /**
   * PromotionRequest delete
   */
  export type PromotionRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
    /**
     * Filter which PromotionRequest to delete.
     */
    where: PromotionRequestWhereUniqueInput
  }

  /**
   * PromotionRequest deleteMany
   */
  export type PromotionRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PromotionRequests to delete
     */
    where?: PromotionRequestWhereInput
  }

  /**
   * PromotionRequest.approvedBy
   */
  export type PromotionRequest$approvedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * PromotionRequest without action
   */
  export type PromotionRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromotionRequest
     */
    select?: PromotionRequestSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromotionRequestInclude<ExtArgs> | null
  }


  /**
   * Model FeePlan
   */

  export type AggregateFeePlan = {
    _count: FeePlanCountAggregateOutputType | null
    _avg: FeePlanAvgAggregateOutputType | null
    _sum: FeePlanSumAggregateOutputType | null
    _min: FeePlanMinAggregateOutputType | null
    _max: FeePlanMaxAggregateOutputType | null
  }

  export type FeePlanAvgAggregateOutputType = {
    monthlyPrice: number | null
  }

  export type FeePlanSumAggregateOutputType = {
    monthlyPrice: number | null
  }

  export type FeePlanMinAggregateOutputType = {
    id: string | null
    name: string | null
    monthlyPrice: number | null
  }

  export type FeePlanMaxAggregateOutputType = {
    id: string | null
    name: string | null
    monthlyPrice: number | null
  }

  export type FeePlanCountAggregateOutputType = {
    id: number
    name: number
    monthlyPrice: number
    _all: number
  }


  export type FeePlanAvgAggregateInputType = {
    monthlyPrice?: true
  }

  export type FeePlanSumAggregateInputType = {
    monthlyPrice?: true
  }

  export type FeePlanMinAggregateInputType = {
    id?: true
    name?: true
    monthlyPrice?: true
  }

  export type FeePlanMaxAggregateInputType = {
    id?: true
    name?: true
    monthlyPrice?: true
  }

  export type FeePlanCountAggregateInputType = {
    id?: true
    name?: true
    monthlyPrice?: true
    _all?: true
  }

  export type FeePlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FeePlan to aggregate.
     */
    where?: FeePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeePlans to fetch.
     */
    orderBy?: FeePlanOrderByWithRelationInput | FeePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FeePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FeePlans
    **/
    _count?: true | FeePlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FeePlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FeePlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeePlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeePlanMaxAggregateInputType
  }

  export type GetFeePlanAggregateType<T extends FeePlanAggregateArgs> = {
        [P in keyof T & keyof AggregateFeePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeePlan[P]>
      : GetScalarType<T[P], AggregateFeePlan[P]>
  }




  export type FeePlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeePlanWhereInput
    orderBy?: FeePlanOrderByWithAggregationInput | FeePlanOrderByWithAggregationInput[]
    by: FeePlanScalarFieldEnum[] | FeePlanScalarFieldEnum
    having?: FeePlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeePlanCountAggregateInputType | true
    _avg?: FeePlanAvgAggregateInputType
    _sum?: FeePlanSumAggregateInputType
    _min?: FeePlanMinAggregateInputType
    _max?: FeePlanMaxAggregateInputType
  }

  export type FeePlanGroupByOutputType = {
    id: string
    name: string
    monthlyPrice: number
    _count: FeePlanCountAggregateOutputType | null
    _avg: FeePlanAvgAggregateOutputType | null
    _sum: FeePlanSumAggregateOutputType | null
    _min: FeePlanMinAggregateOutputType | null
    _max: FeePlanMaxAggregateOutputType | null
  }

  type GetFeePlanGroupByPayload<T extends FeePlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeePlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeePlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeePlanGroupByOutputType[P]>
            : GetScalarType<T[P], FeePlanGroupByOutputType[P]>
        }
      >
    >


  export type FeePlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    monthlyPrice?: boolean
    subscriptions?: boolean | FeePlan$subscriptionsArgs<ExtArgs>
    _count?: boolean | FeePlanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feePlan"]>

  export type FeePlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    monthlyPrice?: boolean
  }, ExtArgs["result"]["feePlan"]>

  export type FeePlanSelectScalar = {
    id?: boolean
    name?: boolean
    monthlyPrice?: boolean
  }

  export type FeePlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | FeePlan$subscriptionsArgs<ExtArgs>
    _count?: boolean | FeePlanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FeePlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $FeePlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FeePlan"
    objects: {
      subscriptions: Prisma.$StudentSubscriptionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      monthlyPrice: number
    }, ExtArgs["result"]["feePlan"]>
    composites: {}
  }

  type FeePlanGetPayload<S extends boolean | null | undefined | FeePlanDefaultArgs> = $Result.GetResult<Prisma.$FeePlanPayload, S>

  type FeePlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FeePlanFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FeePlanCountAggregateInputType | true
    }

  export interface FeePlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FeePlan'], meta: { name: 'FeePlan' } }
    /**
     * Find zero or one FeePlan that matches the filter.
     * @param {FeePlanFindUniqueArgs} args - Arguments to find a FeePlan
     * @example
     * // Get one FeePlan
     * const feePlan = await prisma.feePlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FeePlanFindUniqueArgs>(args: SelectSubset<T, FeePlanFindUniqueArgs<ExtArgs>>): Prisma__FeePlanClient<$Result.GetResult<Prisma.$FeePlanPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FeePlan that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FeePlanFindUniqueOrThrowArgs} args - Arguments to find a FeePlan
     * @example
     * // Get one FeePlan
     * const feePlan = await prisma.feePlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FeePlanFindUniqueOrThrowArgs>(args: SelectSubset<T, FeePlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FeePlanClient<$Result.GetResult<Prisma.$FeePlanPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FeePlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeePlanFindFirstArgs} args - Arguments to find a FeePlan
     * @example
     * // Get one FeePlan
     * const feePlan = await prisma.feePlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FeePlanFindFirstArgs>(args?: SelectSubset<T, FeePlanFindFirstArgs<ExtArgs>>): Prisma__FeePlanClient<$Result.GetResult<Prisma.$FeePlanPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FeePlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeePlanFindFirstOrThrowArgs} args - Arguments to find a FeePlan
     * @example
     * // Get one FeePlan
     * const feePlan = await prisma.feePlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FeePlanFindFirstOrThrowArgs>(args?: SelectSubset<T, FeePlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__FeePlanClient<$Result.GetResult<Prisma.$FeePlanPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FeePlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeePlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FeePlans
     * const feePlans = await prisma.feePlan.findMany()
     * 
     * // Get first 10 FeePlans
     * const feePlans = await prisma.feePlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feePlanWithIdOnly = await prisma.feePlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FeePlanFindManyArgs>(args?: SelectSubset<T, FeePlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeePlanPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FeePlan.
     * @param {FeePlanCreateArgs} args - Arguments to create a FeePlan.
     * @example
     * // Create one FeePlan
     * const FeePlan = await prisma.feePlan.create({
     *   data: {
     *     // ... data to create a FeePlan
     *   }
     * })
     * 
     */
    create<T extends FeePlanCreateArgs>(args: SelectSubset<T, FeePlanCreateArgs<ExtArgs>>): Prisma__FeePlanClient<$Result.GetResult<Prisma.$FeePlanPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FeePlans.
     * @param {FeePlanCreateManyArgs} args - Arguments to create many FeePlans.
     * @example
     * // Create many FeePlans
     * const feePlan = await prisma.feePlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FeePlanCreateManyArgs>(args?: SelectSubset<T, FeePlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FeePlans and returns the data saved in the database.
     * @param {FeePlanCreateManyAndReturnArgs} args - Arguments to create many FeePlans.
     * @example
     * // Create many FeePlans
     * const feePlan = await prisma.feePlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FeePlans and only return the `id`
     * const feePlanWithIdOnly = await prisma.feePlan.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FeePlanCreateManyAndReturnArgs>(args?: SelectSubset<T, FeePlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeePlanPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FeePlan.
     * @param {FeePlanDeleteArgs} args - Arguments to delete one FeePlan.
     * @example
     * // Delete one FeePlan
     * const FeePlan = await prisma.feePlan.delete({
     *   where: {
     *     // ... filter to delete one FeePlan
     *   }
     * })
     * 
     */
    delete<T extends FeePlanDeleteArgs>(args: SelectSubset<T, FeePlanDeleteArgs<ExtArgs>>): Prisma__FeePlanClient<$Result.GetResult<Prisma.$FeePlanPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FeePlan.
     * @param {FeePlanUpdateArgs} args - Arguments to update one FeePlan.
     * @example
     * // Update one FeePlan
     * const feePlan = await prisma.feePlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FeePlanUpdateArgs>(args: SelectSubset<T, FeePlanUpdateArgs<ExtArgs>>): Prisma__FeePlanClient<$Result.GetResult<Prisma.$FeePlanPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FeePlans.
     * @param {FeePlanDeleteManyArgs} args - Arguments to filter FeePlans to delete.
     * @example
     * // Delete a few FeePlans
     * const { count } = await prisma.feePlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FeePlanDeleteManyArgs>(args?: SelectSubset<T, FeePlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FeePlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeePlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FeePlans
     * const feePlan = await prisma.feePlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FeePlanUpdateManyArgs>(args: SelectSubset<T, FeePlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FeePlan.
     * @param {FeePlanUpsertArgs} args - Arguments to update or create a FeePlan.
     * @example
     * // Update or create a FeePlan
     * const feePlan = await prisma.feePlan.upsert({
     *   create: {
     *     // ... data to create a FeePlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FeePlan we want to update
     *   }
     * })
     */
    upsert<T extends FeePlanUpsertArgs>(args: SelectSubset<T, FeePlanUpsertArgs<ExtArgs>>): Prisma__FeePlanClient<$Result.GetResult<Prisma.$FeePlanPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FeePlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeePlanCountArgs} args - Arguments to filter FeePlans to count.
     * @example
     * // Count the number of FeePlans
     * const count = await prisma.feePlan.count({
     *   where: {
     *     // ... the filter for the FeePlans we want to count
     *   }
     * })
    **/
    count<T extends FeePlanCountArgs>(
      args?: Subset<T, FeePlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeePlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FeePlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeePlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeePlanAggregateArgs>(args: Subset<T, FeePlanAggregateArgs>): Prisma.PrismaPromise<GetFeePlanAggregateType<T>>

    /**
     * Group by FeePlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeePlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FeePlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FeePlanGroupByArgs['orderBy'] }
        : { orderBy?: FeePlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FeePlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeePlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FeePlan model
   */
  readonly fields: FeePlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FeePlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FeePlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subscriptions<T extends FeePlan$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, FeePlan$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FeePlan model
   */ 
  interface FeePlanFieldRefs {
    readonly id: FieldRef<"FeePlan", 'String'>
    readonly name: FieldRef<"FeePlan", 'String'>
    readonly monthlyPrice: FieldRef<"FeePlan", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * FeePlan findUnique
   */
  export type FeePlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlan
     */
    select?: FeePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeePlanInclude<ExtArgs> | null
    /**
     * Filter, which FeePlan to fetch.
     */
    where: FeePlanWhereUniqueInput
  }

  /**
   * FeePlan findUniqueOrThrow
   */
  export type FeePlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlan
     */
    select?: FeePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeePlanInclude<ExtArgs> | null
    /**
     * Filter, which FeePlan to fetch.
     */
    where: FeePlanWhereUniqueInput
  }

  /**
   * FeePlan findFirst
   */
  export type FeePlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlan
     */
    select?: FeePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeePlanInclude<ExtArgs> | null
    /**
     * Filter, which FeePlan to fetch.
     */
    where?: FeePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeePlans to fetch.
     */
    orderBy?: FeePlanOrderByWithRelationInput | FeePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FeePlans.
     */
    cursor?: FeePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FeePlans.
     */
    distinct?: FeePlanScalarFieldEnum | FeePlanScalarFieldEnum[]
  }

  /**
   * FeePlan findFirstOrThrow
   */
  export type FeePlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlan
     */
    select?: FeePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeePlanInclude<ExtArgs> | null
    /**
     * Filter, which FeePlan to fetch.
     */
    where?: FeePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeePlans to fetch.
     */
    orderBy?: FeePlanOrderByWithRelationInput | FeePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FeePlans.
     */
    cursor?: FeePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FeePlans.
     */
    distinct?: FeePlanScalarFieldEnum | FeePlanScalarFieldEnum[]
  }

  /**
   * FeePlan findMany
   */
  export type FeePlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlan
     */
    select?: FeePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeePlanInclude<ExtArgs> | null
    /**
     * Filter, which FeePlans to fetch.
     */
    where?: FeePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeePlans to fetch.
     */
    orderBy?: FeePlanOrderByWithRelationInput | FeePlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FeePlans.
     */
    cursor?: FeePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeePlans.
     */
    skip?: number
    distinct?: FeePlanScalarFieldEnum | FeePlanScalarFieldEnum[]
  }

  /**
   * FeePlan create
   */
  export type FeePlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlan
     */
    select?: FeePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeePlanInclude<ExtArgs> | null
    /**
     * The data needed to create a FeePlan.
     */
    data: XOR<FeePlanCreateInput, FeePlanUncheckedCreateInput>
  }

  /**
   * FeePlan createMany
   */
  export type FeePlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FeePlans.
     */
    data: FeePlanCreateManyInput | FeePlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FeePlan createManyAndReturn
   */
  export type FeePlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlan
     */
    select?: FeePlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FeePlans.
     */
    data: FeePlanCreateManyInput | FeePlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FeePlan update
   */
  export type FeePlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlan
     */
    select?: FeePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeePlanInclude<ExtArgs> | null
    /**
     * The data needed to update a FeePlan.
     */
    data: XOR<FeePlanUpdateInput, FeePlanUncheckedUpdateInput>
    /**
     * Choose, which FeePlan to update.
     */
    where: FeePlanWhereUniqueInput
  }

  /**
   * FeePlan updateMany
   */
  export type FeePlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FeePlans.
     */
    data: XOR<FeePlanUpdateManyMutationInput, FeePlanUncheckedUpdateManyInput>
    /**
     * Filter which FeePlans to update
     */
    where?: FeePlanWhereInput
  }

  /**
   * FeePlan upsert
   */
  export type FeePlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlan
     */
    select?: FeePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeePlanInclude<ExtArgs> | null
    /**
     * The filter to search for the FeePlan to update in case it exists.
     */
    where: FeePlanWhereUniqueInput
    /**
     * In case the FeePlan found by the `where` argument doesn't exist, create a new FeePlan with this data.
     */
    create: XOR<FeePlanCreateInput, FeePlanUncheckedCreateInput>
    /**
     * In case the FeePlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FeePlanUpdateInput, FeePlanUncheckedUpdateInput>
  }

  /**
   * FeePlan delete
   */
  export type FeePlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlan
     */
    select?: FeePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeePlanInclude<ExtArgs> | null
    /**
     * Filter which FeePlan to delete.
     */
    where: FeePlanWhereUniqueInput
  }

  /**
   * FeePlan deleteMany
   */
  export type FeePlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FeePlans to delete
     */
    where?: FeePlanWhereInput
  }

  /**
   * FeePlan.subscriptions
   */
  export type FeePlan$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
    where?: StudentSubscriptionWhereInput
    orderBy?: StudentSubscriptionOrderByWithRelationInput | StudentSubscriptionOrderByWithRelationInput[]
    cursor?: StudentSubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentSubscriptionScalarFieldEnum | StudentSubscriptionScalarFieldEnum[]
  }

  /**
   * FeePlan without action
   */
  export type FeePlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeePlan
     */
    select?: FeePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeePlanInclude<ExtArgs> | null
  }


  /**
   * Model StudentSubscription
   */

  export type AggregateStudentSubscription = {
    _count: StudentSubscriptionCountAggregateOutputType | null
    _min: StudentSubscriptionMinAggregateOutputType | null
    _max: StudentSubscriptionMaxAggregateOutputType | null
  }

  export type StudentSubscriptionMinAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    feePlanId: string | null
    isActive: boolean | null
    mandateReference: string | null
  }

  export type StudentSubscriptionMaxAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    feePlanId: string | null
    isActive: boolean | null
    mandateReference: string | null
  }

  export type StudentSubscriptionCountAggregateOutputType = {
    id: number
    studentProfileId: number
    feePlanId: number
    isActive: number
    mandateReference: number
    _all: number
  }


  export type StudentSubscriptionMinAggregateInputType = {
    id?: true
    studentProfileId?: true
    feePlanId?: true
    isActive?: true
    mandateReference?: true
  }

  export type StudentSubscriptionMaxAggregateInputType = {
    id?: true
    studentProfileId?: true
    feePlanId?: true
    isActive?: true
    mandateReference?: true
  }

  export type StudentSubscriptionCountAggregateInputType = {
    id?: true
    studentProfileId?: true
    feePlanId?: true
    isActive?: true
    mandateReference?: true
    _all?: true
  }

  export type StudentSubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentSubscription to aggregate.
     */
    where?: StudentSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentSubscriptions to fetch.
     */
    orderBy?: StudentSubscriptionOrderByWithRelationInput | StudentSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudentSubscriptions
    **/
    _count?: true | StudentSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentSubscriptionMaxAggregateInputType
  }

  export type GetStudentSubscriptionAggregateType<T extends StudentSubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateStudentSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudentSubscription[P]>
      : GetScalarType<T[P], AggregateStudentSubscription[P]>
  }




  export type StudentSubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentSubscriptionWhereInput
    orderBy?: StudentSubscriptionOrderByWithAggregationInput | StudentSubscriptionOrderByWithAggregationInput[]
    by: StudentSubscriptionScalarFieldEnum[] | StudentSubscriptionScalarFieldEnum
    having?: StudentSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentSubscriptionCountAggregateInputType | true
    _min?: StudentSubscriptionMinAggregateInputType
    _max?: StudentSubscriptionMaxAggregateInputType
  }

  export type StudentSubscriptionGroupByOutputType = {
    id: string
    studentProfileId: string
    feePlanId: string
    isActive: boolean
    mandateReference: string | null
    _count: StudentSubscriptionCountAggregateOutputType | null
    _min: StudentSubscriptionMinAggregateOutputType | null
    _max: StudentSubscriptionMaxAggregateOutputType | null
  }

  type GetStudentSubscriptionGroupByPayload<T extends StudentSubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentSubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentSubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentSubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], StudentSubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type StudentSubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    feePlanId?: boolean
    isActive?: boolean
    mandateReference?: boolean
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    feePlan?: boolean | FeePlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentSubscription"]>

  export type StudentSubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    feePlanId?: boolean
    isActive?: boolean
    mandateReference?: boolean
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    feePlan?: boolean | FeePlanDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentSubscription"]>

  export type StudentSubscriptionSelectScalar = {
    id?: boolean
    studentProfileId?: boolean
    feePlanId?: boolean
    isActive?: boolean
    mandateReference?: boolean
  }

  export type StudentSubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    feePlan?: boolean | FeePlanDefaultArgs<ExtArgs>
  }
  export type StudentSubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    feePlan?: boolean | FeePlanDefaultArgs<ExtArgs>
  }

  export type $StudentSubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentSubscription"
    objects: {
      student: Prisma.$StudentProfilePayload<ExtArgs>
      feePlan: Prisma.$FeePlanPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentProfileId: string
      feePlanId: string
      isActive: boolean
      mandateReference: string | null
    }, ExtArgs["result"]["studentSubscription"]>
    composites: {}
  }

  type StudentSubscriptionGetPayload<S extends boolean | null | undefined | StudentSubscriptionDefaultArgs> = $Result.GetResult<Prisma.$StudentSubscriptionPayload, S>

  type StudentSubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StudentSubscriptionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StudentSubscriptionCountAggregateInputType | true
    }

  export interface StudentSubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudentSubscription'], meta: { name: 'StudentSubscription' } }
    /**
     * Find zero or one StudentSubscription that matches the filter.
     * @param {StudentSubscriptionFindUniqueArgs} args - Arguments to find a StudentSubscription
     * @example
     * // Get one StudentSubscription
     * const studentSubscription = await prisma.studentSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentSubscriptionFindUniqueArgs>(args: SelectSubset<T, StudentSubscriptionFindUniqueArgs<ExtArgs>>): Prisma__StudentSubscriptionClient<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StudentSubscription that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StudentSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a StudentSubscription
     * @example
     * // Get one StudentSubscription
     * const studentSubscription = await prisma.studentSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentSubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentSubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentSubscriptionClient<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StudentSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubscriptionFindFirstArgs} args - Arguments to find a StudentSubscription
     * @example
     * // Get one StudentSubscription
     * const studentSubscription = await prisma.studentSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentSubscriptionFindFirstArgs>(args?: SelectSubset<T, StudentSubscriptionFindFirstArgs<ExtArgs>>): Prisma__StudentSubscriptionClient<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StudentSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubscriptionFindFirstOrThrowArgs} args - Arguments to find a StudentSubscription
     * @example
     * // Get one StudentSubscription
     * const studentSubscription = await prisma.studentSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentSubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentSubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentSubscriptionClient<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StudentSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudentSubscriptions
     * const studentSubscriptions = await prisma.studentSubscription.findMany()
     * 
     * // Get first 10 StudentSubscriptions
     * const studentSubscriptions = await prisma.studentSubscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentSubscriptionWithIdOnly = await prisma.studentSubscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentSubscriptionFindManyArgs>(args?: SelectSubset<T, StudentSubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StudentSubscription.
     * @param {StudentSubscriptionCreateArgs} args - Arguments to create a StudentSubscription.
     * @example
     * // Create one StudentSubscription
     * const StudentSubscription = await prisma.studentSubscription.create({
     *   data: {
     *     // ... data to create a StudentSubscription
     *   }
     * })
     * 
     */
    create<T extends StudentSubscriptionCreateArgs>(args: SelectSubset<T, StudentSubscriptionCreateArgs<ExtArgs>>): Prisma__StudentSubscriptionClient<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StudentSubscriptions.
     * @param {StudentSubscriptionCreateManyArgs} args - Arguments to create many StudentSubscriptions.
     * @example
     * // Create many StudentSubscriptions
     * const studentSubscription = await prisma.studentSubscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentSubscriptionCreateManyArgs>(args?: SelectSubset<T, StudentSubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudentSubscriptions and returns the data saved in the database.
     * @param {StudentSubscriptionCreateManyAndReturnArgs} args - Arguments to create many StudentSubscriptions.
     * @example
     * // Create many StudentSubscriptions
     * const studentSubscription = await prisma.studentSubscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudentSubscriptions and only return the `id`
     * const studentSubscriptionWithIdOnly = await prisma.studentSubscription.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentSubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentSubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StudentSubscription.
     * @param {StudentSubscriptionDeleteArgs} args - Arguments to delete one StudentSubscription.
     * @example
     * // Delete one StudentSubscription
     * const StudentSubscription = await prisma.studentSubscription.delete({
     *   where: {
     *     // ... filter to delete one StudentSubscription
     *   }
     * })
     * 
     */
    delete<T extends StudentSubscriptionDeleteArgs>(args: SelectSubset<T, StudentSubscriptionDeleteArgs<ExtArgs>>): Prisma__StudentSubscriptionClient<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StudentSubscription.
     * @param {StudentSubscriptionUpdateArgs} args - Arguments to update one StudentSubscription.
     * @example
     * // Update one StudentSubscription
     * const studentSubscription = await prisma.studentSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentSubscriptionUpdateArgs>(args: SelectSubset<T, StudentSubscriptionUpdateArgs<ExtArgs>>): Prisma__StudentSubscriptionClient<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StudentSubscriptions.
     * @param {StudentSubscriptionDeleteManyArgs} args - Arguments to filter StudentSubscriptions to delete.
     * @example
     * // Delete a few StudentSubscriptions
     * const { count } = await prisma.studentSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentSubscriptionDeleteManyArgs>(args?: SelectSubset<T, StudentSubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudentSubscriptions
     * const studentSubscription = await prisma.studentSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentSubscriptionUpdateManyArgs>(args: SelectSubset<T, StudentSubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StudentSubscription.
     * @param {StudentSubscriptionUpsertArgs} args - Arguments to update or create a StudentSubscription.
     * @example
     * // Update or create a StudentSubscription
     * const studentSubscription = await prisma.studentSubscription.upsert({
     *   create: {
     *     // ... data to create a StudentSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudentSubscription we want to update
     *   }
     * })
     */
    upsert<T extends StudentSubscriptionUpsertArgs>(args: SelectSubset<T, StudentSubscriptionUpsertArgs<ExtArgs>>): Prisma__StudentSubscriptionClient<$Result.GetResult<Prisma.$StudentSubscriptionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StudentSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubscriptionCountArgs} args - Arguments to filter StudentSubscriptions to count.
     * @example
     * // Count the number of StudentSubscriptions
     * const count = await prisma.studentSubscription.count({
     *   where: {
     *     // ... the filter for the StudentSubscriptions we want to count
     *   }
     * })
    **/
    count<T extends StudentSubscriptionCountArgs>(
      args?: Subset<T, StudentSubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudentSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentSubscriptionAggregateArgs>(args: Subset<T, StudentSubscriptionAggregateArgs>): Prisma.PrismaPromise<GetStudentSubscriptionAggregateType<T>>

    /**
     * Group by StudentSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentSubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: StudentSubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentSubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudentSubscription model
   */
  readonly fields: StudentSubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudentSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentSubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfileDefaultArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    feePlan<T extends FeePlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FeePlanDefaultArgs<ExtArgs>>): Prisma__FeePlanClient<$Result.GetResult<Prisma.$FeePlanPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StudentSubscription model
   */ 
  interface StudentSubscriptionFieldRefs {
    readonly id: FieldRef<"StudentSubscription", 'String'>
    readonly studentProfileId: FieldRef<"StudentSubscription", 'String'>
    readonly feePlanId: FieldRef<"StudentSubscription", 'String'>
    readonly isActive: FieldRef<"StudentSubscription", 'Boolean'>
    readonly mandateReference: FieldRef<"StudentSubscription", 'String'>
  }
    

  // Custom InputTypes
  /**
   * StudentSubscription findUnique
   */
  export type StudentSubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which StudentSubscription to fetch.
     */
    where: StudentSubscriptionWhereUniqueInput
  }

  /**
   * StudentSubscription findUniqueOrThrow
   */
  export type StudentSubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which StudentSubscription to fetch.
     */
    where: StudentSubscriptionWhereUniqueInput
  }

  /**
   * StudentSubscription findFirst
   */
  export type StudentSubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which StudentSubscription to fetch.
     */
    where?: StudentSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentSubscriptions to fetch.
     */
    orderBy?: StudentSubscriptionOrderByWithRelationInput | StudentSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentSubscriptions.
     */
    cursor?: StudentSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentSubscriptions.
     */
    distinct?: StudentSubscriptionScalarFieldEnum | StudentSubscriptionScalarFieldEnum[]
  }

  /**
   * StudentSubscription findFirstOrThrow
   */
  export type StudentSubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which StudentSubscription to fetch.
     */
    where?: StudentSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentSubscriptions to fetch.
     */
    orderBy?: StudentSubscriptionOrderByWithRelationInput | StudentSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentSubscriptions.
     */
    cursor?: StudentSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentSubscriptions.
     */
    distinct?: StudentSubscriptionScalarFieldEnum | StudentSubscriptionScalarFieldEnum[]
  }

  /**
   * StudentSubscription findMany
   */
  export type StudentSubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which StudentSubscriptions to fetch.
     */
    where?: StudentSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentSubscriptions to fetch.
     */
    orderBy?: StudentSubscriptionOrderByWithRelationInput | StudentSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudentSubscriptions.
     */
    cursor?: StudentSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentSubscriptions.
     */
    skip?: number
    distinct?: StudentSubscriptionScalarFieldEnum | StudentSubscriptionScalarFieldEnum[]
  }

  /**
   * StudentSubscription create
   */
  export type StudentSubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a StudentSubscription.
     */
    data: XOR<StudentSubscriptionCreateInput, StudentSubscriptionUncheckedCreateInput>
  }

  /**
   * StudentSubscription createMany
   */
  export type StudentSubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudentSubscriptions.
     */
    data: StudentSubscriptionCreateManyInput | StudentSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StudentSubscription createManyAndReturn
   */
  export type StudentSubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StudentSubscriptions.
     */
    data: StudentSubscriptionCreateManyInput | StudentSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentSubscription update
   */
  export type StudentSubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a StudentSubscription.
     */
    data: XOR<StudentSubscriptionUpdateInput, StudentSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which StudentSubscription to update.
     */
    where: StudentSubscriptionWhereUniqueInput
  }

  /**
   * StudentSubscription updateMany
   */
  export type StudentSubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudentSubscriptions.
     */
    data: XOR<StudentSubscriptionUpdateManyMutationInput, StudentSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which StudentSubscriptions to update
     */
    where?: StudentSubscriptionWhereInput
  }

  /**
   * StudentSubscription upsert
   */
  export type StudentSubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the StudentSubscription to update in case it exists.
     */
    where: StudentSubscriptionWhereUniqueInput
    /**
     * In case the StudentSubscription found by the `where` argument doesn't exist, create a new StudentSubscription with this data.
     */
    create: XOR<StudentSubscriptionCreateInput, StudentSubscriptionUncheckedCreateInput>
    /**
     * In case the StudentSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentSubscriptionUpdateInput, StudentSubscriptionUncheckedUpdateInput>
  }

  /**
   * StudentSubscription delete
   */
  export type StudentSubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
    /**
     * Filter which StudentSubscription to delete.
     */
    where: StudentSubscriptionWhereUniqueInput
  }

  /**
   * StudentSubscription deleteMany
   */
  export type StudentSubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentSubscriptions to delete
     */
    where?: StudentSubscriptionWhereInput
  }

  /**
   * StudentSubscription without action
   */
  export type StudentSubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentSubscription
     */
    select?: StudentSubscriptionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentSubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model Federation
   */

  export type AggregateFederation = {
    _count: FederationCountAggregateOutputType | null
    _min: FederationMinAggregateOutputType | null
    _max: FederationMaxAggregateOutputType | null
  }

  export type FederationMinAggregateOutputType = {
    id: string | null
    name: string | null
    country: string | null
  }

  export type FederationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    country: string | null
  }

  export type FederationCountAggregateOutputType = {
    id: number
    name: number
    country: number
    _all: number
  }


  export type FederationMinAggregateInputType = {
    id?: true
    name?: true
    country?: true
  }

  export type FederationMaxAggregateInputType = {
    id?: true
    name?: true
    country?: true
  }

  export type FederationCountAggregateInputType = {
    id?: true
    name?: true
    country?: true
    _all?: true
  }

  export type FederationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Federation to aggregate.
     */
    where?: FederationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Federations to fetch.
     */
    orderBy?: FederationOrderByWithRelationInput | FederationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FederationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Federations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Federations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Federations
    **/
    _count?: true | FederationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FederationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FederationMaxAggregateInputType
  }

  export type GetFederationAggregateType<T extends FederationAggregateArgs> = {
        [P in keyof T & keyof AggregateFederation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFederation[P]>
      : GetScalarType<T[P], AggregateFederation[P]>
  }




  export type FederationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FederationWhereInput
    orderBy?: FederationOrderByWithAggregationInput | FederationOrderByWithAggregationInput[]
    by: FederationScalarFieldEnum[] | FederationScalarFieldEnum
    having?: FederationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FederationCountAggregateInputType | true
    _min?: FederationMinAggregateInputType
    _max?: FederationMaxAggregateInputType
  }

  export type FederationGroupByOutputType = {
    id: string
    name: string
    country: string
    _count: FederationCountAggregateOutputType | null
    _min: FederationMinAggregateOutputType | null
    _max: FederationMaxAggregateOutputType | null
  }

  type GetFederationGroupByPayload<T extends FederationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FederationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FederationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FederationGroupByOutputType[P]>
            : GetScalarType<T[P], FederationGroupByOutputType[P]>
        }
      >
    >


  export type FederationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    country?: boolean
    licenses?: boolean | Federation$licensesArgs<ExtArgs>
    _count?: boolean | FederationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["federation"]>

  export type FederationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    country?: boolean
  }, ExtArgs["result"]["federation"]>

  export type FederationSelectScalar = {
    id?: boolean
    name?: boolean
    country?: boolean
  }

  export type FederationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    licenses?: boolean | Federation$licensesArgs<ExtArgs>
    _count?: boolean | FederationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FederationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $FederationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Federation"
    objects: {
      licenses: Prisma.$StudentLicensePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      country: string
    }, ExtArgs["result"]["federation"]>
    composites: {}
  }

  type FederationGetPayload<S extends boolean | null | undefined | FederationDefaultArgs> = $Result.GetResult<Prisma.$FederationPayload, S>

  type FederationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FederationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FederationCountAggregateInputType | true
    }

  export interface FederationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Federation'], meta: { name: 'Federation' } }
    /**
     * Find zero or one Federation that matches the filter.
     * @param {FederationFindUniqueArgs} args - Arguments to find a Federation
     * @example
     * // Get one Federation
     * const federation = await prisma.federation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FederationFindUniqueArgs>(args: SelectSubset<T, FederationFindUniqueArgs<ExtArgs>>): Prisma__FederationClient<$Result.GetResult<Prisma.$FederationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Federation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FederationFindUniqueOrThrowArgs} args - Arguments to find a Federation
     * @example
     * // Get one Federation
     * const federation = await prisma.federation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FederationFindUniqueOrThrowArgs>(args: SelectSubset<T, FederationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FederationClient<$Result.GetResult<Prisma.$FederationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Federation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FederationFindFirstArgs} args - Arguments to find a Federation
     * @example
     * // Get one Federation
     * const federation = await prisma.federation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FederationFindFirstArgs>(args?: SelectSubset<T, FederationFindFirstArgs<ExtArgs>>): Prisma__FederationClient<$Result.GetResult<Prisma.$FederationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Federation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FederationFindFirstOrThrowArgs} args - Arguments to find a Federation
     * @example
     * // Get one Federation
     * const federation = await prisma.federation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FederationFindFirstOrThrowArgs>(args?: SelectSubset<T, FederationFindFirstOrThrowArgs<ExtArgs>>): Prisma__FederationClient<$Result.GetResult<Prisma.$FederationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Federations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FederationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Federations
     * const federations = await prisma.federation.findMany()
     * 
     * // Get first 10 Federations
     * const federations = await prisma.federation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const federationWithIdOnly = await prisma.federation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FederationFindManyArgs>(args?: SelectSubset<T, FederationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FederationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Federation.
     * @param {FederationCreateArgs} args - Arguments to create a Federation.
     * @example
     * // Create one Federation
     * const Federation = await prisma.federation.create({
     *   data: {
     *     // ... data to create a Federation
     *   }
     * })
     * 
     */
    create<T extends FederationCreateArgs>(args: SelectSubset<T, FederationCreateArgs<ExtArgs>>): Prisma__FederationClient<$Result.GetResult<Prisma.$FederationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Federations.
     * @param {FederationCreateManyArgs} args - Arguments to create many Federations.
     * @example
     * // Create many Federations
     * const federation = await prisma.federation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FederationCreateManyArgs>(args?: SelectSubset<T, FederationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Federations and returns the data saved in the database.
     * @param {FederationCreateManyAndReturnArgs} args - Arguments to create many Federations.
     * @example
     * // Create many Federations
     * const federation = await prisma.federation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Federations and only return the `id`
     * const federationWithIdOnly = await prisma.federation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FederationCreateManyAndReturnArgs>(args?: SelectSubset<T, FederationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FederationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Federation.
     * @param {FederationDeleteArgs} args - Arguments to delete one Federation.
     * @example
     * // Delete one Federation
     * const Federation = await prisma.federation.delete({
     *   where: {
     *     // ... filter to delete one Federation
     *   }
     * })
     * 
     */
    delete<T extends FederationDeleteArgs>(args: SelectSubset<T, FederationDeleteArgs<ExtArgs>>): Prisma__FederationClient<$Result.GetResult<Prisma.$FederationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Federation.
     * @param {FederationUpdateArgs} args - Arguments to update one Federation.
     * @example
     * // Update one Federation
     * const federation = await prisma.federation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FederationUpdateArgs>(args: SelectSubset<T, FederationUpdateArgs<ExtArgs>>): Prisma__FederationClient<$Result.GetResult<Prisma.$FederationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Federations.
     * @param {FederationDeleteManyArgs} args - Arguments to filter Federations to delete.
     * @example
     * // Delete a few Federations
     * const { count } = await prisma.federation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FederationDeleteManyArgs>(args?: SelectSubset<T, FederationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Federations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FederationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Federations
     * const federation = await prisma.federation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FederationUpdateManyArgs>(args: SelectSubset<T, FederationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Federation.
     * @param {FederationUpsertArgs} args - Arguments to update or create a Federation.
     * @example
     * // Update or create a Federation
     * const federation = await prisma.federation.upsert({
     *   create: {
     *     // ... data to create a Federation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Federation we want to update
     *   }
     * })
     */
    upsert<T extends FederationUpsertArgs>(args: SelectSubset<T, FederationUpsertArgs<ExtArgs>>): Prisma__FederationClient<$Result.GetResult<Prisma.$FederationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Federations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FederationCountArgs} args - Arguments to filter Federations to count.
     * @example
     * // Count the number of Federations
     * const count = await prisma.federation.count({
     *   where: {
     *     // ... the filter for the Federations we want to count
     *   }
     * })
    **/
    count<T extends FederationCountArgs>(
      args?: Subset<T, FederationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FederationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Federation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FederationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FederationAggregateArgs>(args: Subset<T, FederationAggregateArgs>): Prisma.PrismaPromise<GetFederationAggregateType<T>>

    /**
     * Group by Federation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FederationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FederationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FederationGroupByArgs['orderBy'] }
        : { orderBy?: FederationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FederationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFederationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Federation model
   */
  readonly fields: FederationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Federation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FederationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    licenses<T extends Federation$licensesArgs<ExtArgs> = {}>(args?: Subset<T, Federation$licensesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Federation model
   */ 
  interface FederationFieldRefs {
    readonly id: FieldRef<"Federation", 'String'>
    readonly name: FieldRef<"Federation", 'String'>
    readonly country: FieldRef<"Federation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Federation findUnique
   */
  export type FederationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Federation
     */
    select?: FederationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FederationInclude<ExtArgs> | null
    /**
     * Filter, which Federation to fetch.
     */
    where: FederationWhereUniqueInput
  }

  /**
   * Federation findUniqueOrThrow
   */
  export type FederationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Federation
     */
    select?: FederationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FederationInclude<ExtArgs> | null
    /**
     * Filter, which Federation to fetch.
     */
    where: FederationWhereUniqueInput
  }

  /**
   * Federation findFirst
   */
  export type FederationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Federation
     */
    select?: FederationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FederationInclude<ExtArgs> | null
    /**
     * Filter, which Federation to fetch.
     */
    where?: FederationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Federations to fetch.
     */
    orderBy?: FederationOrderByWithRelationInput | FederationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Federations.
     */
    cursor?: FederationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Federations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Federations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Federations.
     */
    distinct?: FederationScalarFieldEnum | FederationScalarFieldEnum[]
  }

  /**
   * Federation findFirstOrThrow
   */
  export type FederationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Federation
     */
    select?: FederationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FederationInclude<ExtArgs> | null
    /**
     * Filter, which Federation to fetch.
     */
    where?: FederationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Federations to fetch.
     */
    orderBy?: FederationOrderByWithRelationInput | FederationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Federations.
     */
    cursor?: FederationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Federations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Federations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Federations.
     */
    distinct?: FederationScalarFieldEnum | FederationScalarFieldEnum[]
  }

  /**
   * Federation findMany
   */
  export type FederationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Federation
     */
    select?: FederationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FederationInclude<ExtArgs> | null
    /**
     * Filter, which Federations to fetch.
     */
    where?: FederationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Federations to fetch.
     */
    orderBy?: FederationOrderByWithRelationInput | FederationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Federations.
     */
    cursor?: FederationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Federations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Federations.
     */
    skip?: number
    distinct?: FederationScalarFieldEnum | FederationScalarFieldEnum[]
  }

  /**
   * Federation create
   */
  export type FederationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Federation
     */
    select?: FederationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FederationInclude<ExtArgs> | null
    /**
     * The data needed to create a Federation.
     */
    data: XOR<FederationCreateInput, FederationUncheckedCreateInput>
  }

  /**
   * Federation createMany
   */
  export type FederationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Federations.
     */
    data: FederationCreateManyInput | FederationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Federation createManyAndReturn
   */
  export type FederationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Federation
     */
    select?: FederationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Federations.
     */
    data: FederationCreateManyInput | FederationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Federation update
   */
  export type FederationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Federation
     */
    select?: FederationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FederationInclude<ExtArgs> | null
    /**
     * The data needed to update a Federation.
     */
    data: XOR<FederationUpdateInput, FederationUncheckedUpdateInput>
    /**
     * Choose, which Federation to update.
     */
    where: FederationWhereUniqueInput
  }

  /**
   * Federation updateMany
   */
  export type FederationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Federations.
     */
    data: XOR<FederationUpdateManyMutationInput, FederationUncheckedUpdateManyInput>
    /**
     * Filter which Federations to update
     */
    where?: FederationWhereInput
  }

  /**
   * Federation upsert
   */
  export type FederationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Federation
     */
    select?: FederationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FederationInclude<ExtArgs> | null
    /**
     * The filter to search for the Federation to update in case it exists.
     */
    where: FederationWhereUniqueInput
    /**
     * In case the Federation found by the `where` argument doesn't exist, create a new Federation with this data.
     */
    create: XOR<FederationCreateInput, FederationUncheckedCreateInput>
    /**
     * In case the Federation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FederationUpdateInput, FederationUncheckedUpdateInput>
  }

  /**
   * Federation delete
   */
  export type FederationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Federation
     */
    select?: FederationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FederationInclude<ExtArgs> | null
    /**
     * Filter which Federation to delete.
     */
    where: FederationWhereUniqueInput
  }

  /**
   * Federation deleteMany
   */
  export type FederationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Federations to delete
     */
    where?: FederationWhereInput
  }

  /**
   * Federation.licenses
   */
  export type Federation$licensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
    where?: StudentLicenseWhereInput
    orderBy?: StudentLicenseOrderByWithRelationInput | StudentLicenseOrderByWithRelationInput[]
    cursor?: StudentLicenseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentLicenseScalarFieldEnum | StudentLicenseScalarFieldEnum[]
  }

  /**
   * Federation without action
   */
  export type FederationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Federation
     */
    select?: FederationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FederationInclude<ExtArgs> | null
  }


  /**
   * Model StudentLicense
   */

  export type AggregateStudentLicense = {
    _count: StudentLicenseCountAggregateOutputType | null
    _min: StudentLicenseMinAggregateOutputType | null
    _max: StudentLicenseMaxAggregateOutputType | null
  }

  export type StudentLicenseMinAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    federationId: string | null
    licenseNumber: string | null
    validUntil: Date | null
    isActive: boolean | null
  }

  export type StudentLicenseMaxAggregateOutputType = {
    id: string | null
    studentProfileId: string | null
    federationId: string | null
    licenseNumber: string | null
    validUntil: Date | null
    isActive: boolean | null
  }

  export type StudentLicenseCountAggregateOutputType = {
    id: number
    studentProfileId: number
    federationId: number
    licenseNumber: number
    validUntil: number
    isActive: number
    _all: number
  }


  export type StudentLicenseMinAggregateInputType = {
    id?: true
    studentProfileId?: true
    federationId?: true
    licenseNumber?: true
    validUntil?: true
    isActive?: true
  }

  export type StudentLicenseMaxAggregateInputType = {
    id?: true
    studentProfileId?: true
    federationId?: true
    licenseNumber?: true
    validUntil?: true
    isActive?: true
  }

  export type StudentLicenseCountAggregateInputType = {
    id?: true
    studentProfileId?: true
    federationId?: true
    licenseNumber?: true
    validUntil?: true
    isActive?: true
    _all?: true
  }

  export type StudentLicenseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentLicense to aggregate.
     */
    where?: StudentLicenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentLicenses to fetch.
     */
    orderBy?: StudentLicenseOrderByWithRelationInput | StudentLicenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentLicenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentLicenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentLicenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StudentLicenses
    **/
    _count?: true | StudentLicenseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentLicenseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentLicenseMaxAggregateInputType
  }

  export type GetStudentLicenseAggregateType<T extends StudentLicenseAggregateArgs> = {
        [P in keyof T & keyof AggregateStudentLicense]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudentLicense[P]>
      : GetScalarType<T[P], AggregateStudentLicense[P]>
  }




  export type StudentLicenseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentLicenseWhereInput
    orderBy?: StudentLicenseOrderByWithAggregationInput | StudentLicenseOrderByWithAggregationInput[]
    by: StudentLicenseScalarFieldEnum[] | StudentLicenseScalarFieldEnum
    having?: StudentLicenseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentLicenseCountAggregateInputType | true
    _min?: StudentLicenseMinAggregateInputType
    _max?: StudentLicenseMaxAggregateInputType
  }

  export type StudentLicenseGroupByOutputType = {
    id: string
    studentProfileId: string
    federationId: string
    licenseNumber: string
    validUntil: Date
    isActive: boolean
    _count: StudentLicenseCountAggregateOutputType | null
    _min: StudentLicenseMinAggregateOutputType | null
    _max: StudentLicenseMaxAggregateOutputType | null
  }

  type GetStudentLicenseGroupByPayload<T extends StudentLicenseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentLicenseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentLicenseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentLicenseGroupByOutputType[P]>
            : GetScalarType<T[P], StudentLicenseGroupByOutputType[P]>
        }
      >
    >


  export type StudentLicenseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    federationId?: boolean
    licenseNumber?: boolean
    validUntil?: boolean
    isActive?: boolean
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    federation?: boolean | FederationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentLicense"]>

  export type StudentLicenseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentProfileId?: boolean
    federationId?: boolean
    licenseNumber?: boolean
    validUntil?: boolean
    isActive?: boolean
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    federation?: boolean | FederationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["studentLicense"]>

  export type StudentLicenseSelectScalar = {
    id?: boolean
    studentProfileId?: boolean
    federationId?: boolean
    licenseNumber?: boolean
    validUntil?: boolean
    isActive?: boolean
  }

  export type StudentLicenseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    federation?: boolean | FederationDefaultArgs<ExtArgs>
  }
  export type StudentLicenseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentProfileDefaultArgs<ExtArgs>
    federation?: boolean | FederationDefaultArgs<ExtArgs>
  }

  export type $StudentLicensePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StudentLicense"
    objects: {
      student: Prisma.$StudentProfilePayload<ExtArgs>
      federation: Prisma.$FederationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentProfileId: string
      federationId: string
      licenseNumber: string
      validUntil: Date
      isActive: boolean
    }, ExtArgs["result"]["studentLicense"]>
    composites: {}
  }

  type StudentLicenseGetPayload<S extends boolean | null | undefined | StudentLicenseDefaultArgs> = $Result.GetResult<Prisma.$StudentLicensePayload, S>

  type StudentLicenseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StudentLicenseFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StudentLicenseCountAggregateInputType | true
    }

  export interface StudentLicenseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StudentLicense'], meta: { name: 'StudentLicense' } }
    /**
     * Find zero or one StudentLicense that matches the filter.
     * @param {StudentLicenseFindUniqueArgs} args - Arguments to find a StudentLicense
     * @example
     * // Get one StudentLicense
     * const studentLicense = await prisma.studentLicense.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentLicenseFindUniqueArgs>(args: SelectSubset<T, StudentLicenseFindUniqueArgs<ExtArgs>>): Prisma__StudentLicenseClient<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StudentLicense that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StudentLicenseFindUniqueOrThrowArgs} args - Arguments to find a StudentLicense
     * @example
     * // Get one StudentLicense
     * const studentLicense = await prisma.studentLicense.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentLicenseFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentLicenseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentLicenseClient<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StudentLicense that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentLicenseFindFirstArgs} args - Arguments to find a StudentLicense
     * @example
     * // Get one StudentLicense
     * const studentLicense = await prisma.studentLicense.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentLicenseFindFirstArgs>(args?: SelectSubset<T, StudentLicenseFindFirstArgs<ExtArgs>>): Prisma__StudentLicenseClient<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StudentLicense that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentLicenseFindFirstOrThrowArgs} args - Arguments to find a StudentLicense
     * @example
     * // Get one StudentLicense
     * const studentLicense = await prisma.studentLicense.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentLicenseFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentLicenseFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentLicenseClient<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StudentLicenses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentLicenseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StudentLicenses
     * const studentLicenses = await prisma.studentLicense.findMany()
     * 
     * // Get first 10 StudentLicenses
     * const studentLicenses = await prisma.studentLicense.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentLicenseWithIdOnly = await prisma.studentLicense.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentLicenseFindManyArgs>(args?: SelectSubset<T, StudentLicenseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StudentLicense.
     * @param {StudentLicenseCreateArgs} args - Arguments to create a StudentLicense.
     * @example
     * // Create one StudentLicense
     * const StudentLicense = await prisma.studentLicense.create({
     *   data: {
     *     // ... data to create a StudentLicense
     *   }
     * })
     * 
     */
    create<T extends StudentLicenseCreateArgs>(args: SelectSubset<T, StudentLicenseCreateArgs<ExtArgs>>): Prisma__StudentLicenseClient<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StudentLicenses.
     * @param {StudentLicenseCreateManyArgs} args - Arguments to create many StudentLicenses.
     * @example
     * // Create many StudentLicenses
     * const studentLicense = await prisma.studentLicense.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentLicenseCreateManyArgs>(args?: SelectSubset<T, StudentLicenseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StudentLicenses and returns the data saved in the database.
     * @param {StudentLicenseCreateManyAndReturnArgs} args - Arguments to create many StudentLicenses.
     * @example
     * // Create many StudentLicenses
     * const studentLicense = await prisma.studentLicense.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StudentLicenses and only return the `id`
     * const studentLicenseWithIdOnly = await prisma.studentLicense.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentLicenseCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentLicenseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StudentLicense.
     * @param {StudentLicenseDeleteArgs} args - Arguments to delete one StudentLicense.
     * @example
     * // Delete one StudentLicense
     * const StudentLicense = await prisma.studentLicense.delete({
     *   where: {
     *     // ... filter to delete one StudentLicense
     *   }
     * })
     * 
     */
    delete<T extends StudentLicenseDeleteArgs>(args: SelectSubset<T, StudentLicenseDeleteArgs<ExtArgs>>): Prisma__StudentLicenseClient<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StudentLicense.
     * @param {StudentLicenseUpdateArgs} args - Arguments to update one StudentLicense.
     * @example
     * // Update one StudentLicense
     * const studentLicense = await prisma.studentLicense.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentLicenseUpdateArgs>(args: SelectSubset<T, StudentLicenseUpdateArgs<ExtArgs>>): Prisma__StudentLicenseClient<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StudentLicenses.
     * @param {StudentLicenseDeleteManyArgs} args - Arguments to filter StudentLicenses to delete.
     * @example
     * // Delete a few StudentLicenses
     * const { count } = await prisma.studentLicense.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentLicenseDeleteManyArgs>(args?: SelectSubset<T, StudentLicenseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StudentLicenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentLicenseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StudentLicenses
     * const studentLicense = await prisma.studentLicense.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentLicenseUpdateManyArgs>(args: SelectSubset<T, StudentLicenseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StudentLicense.
     * @param {StudentLicenseUpsertArgs} args - Arguments to update or create a StudentLicense.
     * @example
     * // Update or create a StudentLicense
     * const studentLicense = await prisma.studentLicense.upsert({
     *   create: {
     *     // ... data to create a StudentLicense
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StudentLicense we want to update
     *   }
     * })
     */
    upsert<T extends StudentLicenseUpsertArgs>(args: SelectSubset<T, StudentLicenseUpsertArgs<ExtArgs>>): Prisma__StudentLicenseClient<$Result.GetResult<Prisma.$StudentLicensePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StudentLicenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentLicenseCountArgs} args - Arguments to filter StudentLicenses to count.
     * @example
     * // Count the number of StudentLicenses
     * const count = await prisma.studentLicense.count({
     *   where: {
     *     // ... the filter for the StudentLicenses we want to count
     *   }
     * })
    **/
    count<T extends StudentLicenseCountArgs>(
      args?: Subset<T, StudentLicenseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentLicenseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StudentLicense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentLicenseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentLicenseAggregateArgs>(args: Subset<T, StudentLicenseAggregateArgs>): Prisma.PrismaPromise<GetStudentLicenseAggregateType<T>>

    /**
     * Group by StudentLicense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentLicenseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentLicenseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentLicenseGroupByArgs['orderBy'] }
        : { orderBy?: StudentLicenseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentLicenseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentLicenseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StudentLicense model
   */
  readonly fields: StudentLicenseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StudentLicense.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentLicenseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentProfileDefaultArgs<ExtArgs>>): Prisma__StudentProfileClient<$Result.GetResult<Prisma.$StudentProfilePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    federation<T extends FederationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FederationDefaultArgs<ExtArgs>>): Prisma__FederationClient<$Result.GetResult<Prisma.$FederationPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StudentLicense model
   */ 
  interface StudentLicenseFieldRefs {
    readonly id: FieldRef<"StudentLicense", 'String'>
    readonly studentProfileId: FieldRef<"StudentLicense", 'String'>
    readonly federationId: FieldRef<"StudentLicense", 'String'>
    readonly licenseNumber: FieldRef<"StudentLicense", 'String'>
    readonly validUntil: FieldRef<"StudentLicense", 'DateTime'>
    readonly isActive: FieldRef<"StudentLicense", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * StudentLicense findUnique
   */
  export type StudentLicenseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
    /**
     * Filter, which StudentLicense to fetch.
     */
    where: StudentLicenseWhereUniqueInput
  }

  /**
   * StudentLicense findUniqueOrThrow
   */
  export type StudentLicenseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
    /**
     * Filter, which StudentLicense to fetch.
     */
    where: StudentLicenseWhereUniqueInput
  }

  /**
   * StudentLicense findFirst
   */
  export type StudentLicenseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
    /**
     * Filter, which StudentLicense to fetch.
     */
    where?: StudentLicenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentLicenses to fetch.
     */
    orderBy?: StudentLicenseOrderByWithRelationInput | StudentLicenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentLicenses.
     */
    cursor?: StudentLicenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentLicenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentLicenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentLicenses.
     */
    distinct?: StudentLicenseScalarFieldEnum | StudentLicenseScalarFieldEnum[]
  }

  /**
   * StudentLicense findFirstOrThrow
   */
  export type StudentLicenseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
    /**
     * Filter, which StudentLicense to fetch.
     */
    where?: StudentLicenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentLicenses to fetch.
     */
    orderBy?: StudentLicenseOrderByWithRelationInput | StudentLicenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StudentLicenses.
     */
    cursor?: StudentLicenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentLicenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentLicenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StudentLicenses.
     */
    distinct?: StudentLicenseScalarFieldEnum | StudentLicenseScalarFieldEnum[]
  }

  /**
   * StudentLicense findMany
   */
  export type StudentLicenseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
    /**
     * Filter, which StudentLicenses to fetch.
     */
    where?: StudentLicenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StudentLicenses to fetch.
     */
    orderBy?: StudentLicenseOrderByWithRelationInput | StudentLicenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StudentLicenses.
     */
    cursor?: StudentLicenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StudentLicenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StudentLicenses.
     */
    skip?: number
    distinct?: StudentLicenseScalarFieldEnum | StudentLicenseScalarFieldEnum[]
  }

  /**
   * StudentLicense create
   */
  export type StudentLicenseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
    /**
     * The data needed to create a StudentLicense.
     */
    data: XOR<StudentLicenseCreateInput, StudentLicenseUncheckedCreateInput>
  }

  /**
   * StudentLicense createMany
   */
  export type StudentLicenseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StudentLicenses.
     */
    data: StudentLicenseCreateManyInput | StudentLicenseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StudentLicense createManyAndReturn
   */
  export type StudentLicenseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StudentLicenses.
     */
    data: StudentLicenseCreateManyInput | StudentLicenseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StudentLicense update
   */
  export type StudentLicenseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
    /**
     * The data needed to update a StudentLicense.
     */
    data: XOR<StudentLicenseUpdateInput, StudentLicenseUncheckedUpdateInput>
    /**
     * Choose, which StudentLicense to update.
     */
    where: StudentLicenseWhereUniqueInput
  }

  /**
   * StudentLicense updateMany
   */
  export type StudentLicenseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StudentLicenses.
     */
    data: XOR<StudentLicenseUpdateManyMutationInput, StudentLicenseUncheckedUpdateManyInput>
    /**
     * Filter which StudentLicenses to update
     */
    where?: StudentLicenseWhereInput
  }

  /**
   * StudentLicense upsert
   */
  export type StudentLicenseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
    /**
     * The filter to search for the StudentLicense to update in case it exists.
     */
    where: StudentLicenseWhereUniqueInput
    /**
     * In case the StudentLicense found by the `where` argument doesn't exist, create a new StudentLicense with this data.
     */
    create: XOR<StudentLicenseCreateInput, StudentLicenseUncheckedCreateInput>
    /**
     * In case the StudentLicense was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentLicenseUpdateInput, StudentLicenseUncheckedUpdateInput>
  }

  /**
   * StudentLicense delete
   */
  export type StudentLicenseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
    /**
     * Filter which StudentLicense to delete.
     */
    where: StudentLicenseWhereUniqueInput
  }

  /**
   * StudentLicense deleteMany
   */
  export type StudentLicenseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StudentLicenses to delete
     */
    where?: StudentLicenseWhereInput
  }

  /**
   * StudentLicense without action
   */
  export type StudentLicenseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentLicense
     */
    select?: StudentLicenseSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentLicenseInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    firstName: 'firstName',
    lastName: 'lastName',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const StudentProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    birthDate: 'birthDate',
    phone: 'phone',
    address: 'address',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StudentProfileScalarFieldEnum = (typeof StudentProfileScalarFieldEnum)[keyof typeof StudentProfileScalarFieldEnum]


  export const GuardianScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    createdAt: 'createdAt'
  };

  export type GuardianScalarFieldEnum = (typeof GuardianScalarFieldEnum)[keyof typeof GuardianScalarFieldEnum]


  export const StudentGuardianScalarFieldEnum: {
    studentProfileId: 'studentProfileId',
    guardianId: 'guardianId',
    relationship: 'relationship'
  };

  export type StudentGuardianScalarFieldEnum = (typeof StudentGuardianScalarFieldEnum)[keyof typeof StudentGuardianScalarFieldEnum]


  export const DisciplineScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description'
  };

  export type DisciplineScalarFieldEnum = (typeof DisciplineScalarFieldEnum)[keyof typeof DisciplineScalarFieldEnum]


  export const DisciplineProgramScalarFieldEnum: {
    id: 'id',
    disciplineId: 'disciplineId',
    name: 'name',
    minAge: 'minAge',
    maxAge: 'maxAge'
  };

  export type DisciplineProgramScalarFieldEnum = (typeof DisciplineProgramScalarFieldEnum)[keyof typeof DisciplineProgramScalarFieldEnum]


  export const BeltRankScalarFieldEnum: {
    id: 'id',
    disciplineProgramId: 'disciplineProgramId',
    name: 'name',
    order: 'order',
    maxStripes: 'maxStripes',
    minMonthsRequired: 'minMonthsRequired',
    minHoursRequired: 'minHoursRequired'
  };

  export type BeltRankScalarFieldEnum = (typeof BeltRankScalarFieldEnum)[keyof typeof BeltRankScalarFieldEnum]


  export const StudentRankScalarFieldEnum: {
    id: 'id',
    studentProfileId: 'studentProfileId',
    beltRankId: 'beltRankId',
    currentStripes: 'currentStripes',
    accumulatedHours: 'accumulatedHours',
    promotedAt: 'promotedAt',
    lastStripeAt: 'lastStripeAt'
  };

  export type StudentRankScalarFieldEnum = (typeof StudentRankScalarFieldEnum)[keyof typeof StudentRankScalarFieldEnum]


  export const AttendanceScalarFieldEnum: {
    id: 'id',
    studentProfileId: 'studentProfileId',
    date: 'date',
    countedForRank: 'countedForRank'
  };

  export type AttendanceScalarFieldEnum = (typeof AttendanceScalarFieldEnum)[keyof typeof AttendanceScalarFieldEnum]


  export const ProfileUpdateRequestScalarFieldEnum: {
    id: 'id',
    studentProfileId: 'studentProfileId',
    requestedChanges: 'requestedChanges',
    status: 'status',
    reviewedById: 'reviewedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProfileUpdateRequestScalarFieldEnum = (typeof ProfileUpdateRequestScalarFieldEnum)[keyof typeof ProfileUpdateRequestScalarFieldEnum]


  export const PromotionRequestScalarFieldEnum: {
    id: 'id',
    studentProfileId: 'studentProfileId',
    proposedBeltId: 'proposedBeltId',
    proposedStripes: 'proposedStripes',
    proposedById: 'proposedById',
    approvedById: 'approvedById',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type PromotionRequestScalarFieldEnum = (typeof PromotionRequestScalarFieldEnum)[keyof typeof PromotionRequestScalarFieldEnum]


  export const FeePlanScalarFieldEnum: {
    id: 'id',
    name: 'name',
    monthlyPrice: 'monthlyPrice'
  };

  export type FeePlanScalarFieldEnum = (typeof FeePlanScalarFieldEnum)[keyof typeof FeePlanScalarFieldEnum]


  export const StudentSubscriptionScalarFieldEnum: {
    id: 'id',
    studentProfileId: 'studentProfileId',
    feePlanId: 'feePlanId',
    isActive: 'isActive',
    mandateReference: 'mandateReference'
  };

  export type StudentSubscriptionScalarFieldEnum = (typeof StudentSubscriptionScalarFieldEnum)[keyof typeof StudentSubscriptionScalarFieldEnum]


  export const FederationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    country: 'country'
  };

  export type FederationScalarFieldEnum = (typeof FederationScalarFieldEnum)[keyof typeof FederationScalarFieldEnum]


  export const StudentLicenseScalarFieldEnum: {
    id: 'id',
    studentProfileId: 'studentProfileId',
    federationId: 'federationId',
    licenseNumber: 'licenseNumber',
    validUntil: 'validUntil',
    isActive: 'isActive'
  };

  export type StudentLicenseScalarFieldEnum = (typeof StudentLicenseScalarFieldEnum)[keyof typeof StudentLicenseScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'RequestStatus'
   */
  export type EnumRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestStatus'>
    


  /**
   * Reference to a field of type 'RequestStatus[]'
   */
  export type ListEnumRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    studentProfile?: XOR<StudentProfileNullableRelationFilter, StudentProfileWhereInput> | null
    guardianProfile?: XOR<GuardianNullableRelationFilter, GuardianWhereInput> | null
    reviewedUpdates?: ProfileUpdateRequestListRelationFilter
    proposedPromotions?: PromotionRequestListRelationFilter
    approvedPromotions?: PromotionRequestListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    studentProfile?: StudentProfileOrderByWithRelationInput
    guardianProfile?: GuardianOrderByWithRelationInput
    reviewedUpdates?: ProfileUpdateRequestOrderByRelationAggregateInput
    proposedPromotions?: PromotionRequestOrderByRelationAggregateInput
    approvedPromotions?: PromotionRequestOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    studentProfile?: XOR<StudentProfileNullableRelationFilter, StudentProfileWhereInput> | null
    guardianProfile?: XOR<GuardianNullableRelationFilter, GuardianWhereInput> | null
    reviewedUpdates?: ProfileUpdateRequestListRelationFilter
    proposedPromotions?: PromotionRequestListRelationFilter
    approvedPromotions?: PromotionRequestListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringWithAggregatesFilter<"User"> | string
    lastName?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type StudentProfileWhereInput = {
    AND?: StudentProfileWhereInput | StudentProfileWhereInput[]
    OR?: StudentProfileWhereInput[]
    NOT?: StudentProfileWhereInput | StudentProfileWhereInput[]
    id?: StringFilter<"StudentProfile"> | string
    userId?: StringFilter<"StudentProfile"> | string
    birthDate?: DateTimeNullableFilter<"StudentProfile"> | Date | string | null
    phone?: StringNullableFilter<"StudentProfile"> | string | null
    address?: StringNullableFilter<"StudentProfile"> | string | null
    createdAt?: DateTimeFilter<"StudentProfile"> | Date | string
    updatedAt?: DateTimeFilter<"StudentProfile"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    guardians?: StudentGuardianListRelationFilter
    ranks?: StudentRankListRelationFilter
    attendances?: AttendanceListRelationFilter
    updateRequests?: ProfileUpdateRequestListRelationFilter
    promotionRequests?: PromotionRequestListRelationFilter
    subscriptions?: StudentSubscriptionListRelationFilter
    licenses?: StudentLicenseListRelationFilter
  }

  export type StudentProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    birthDate?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    guardians?: StudentGuardianOrderByRelationAggregateInput
    ranks?: StudentRankOrderByRelationAggregateInput
    attendances?: AttendanceOrderByRelationAggregateInput
    updateRequests?: ProfileUpdateRequestOrderByRelationAggregateInput
    promotionRequests?: PromotionRequestOrderByRelationAggregateInput
    subscriptions?: StudentSubscriptionOrderByRelationAggregateInput
    licenses?: StudentLicenseOrderByRelationAggregateInput
  }

  export type StudentProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: StudentProfileWhereInput | StudentProfileWhereInput[]
    OR?: StudentProfileWhereInput[]
    NOT?: StudentProfileWhereInput | StudentProfileWhereInput[]
    birthDate?: DateTimeNullableFilter<"StudentProfile"> | Date | string | null
    phone?: StringNullableFilter<"StudentProfile"> | string | null
    address?: StringNullableFilter<"StudentProfile"> | string | null
    createdAt?: DateTimeFilter<"StudentProfile"> | Date | string
    updatedAt?: DateTimeFilter<"StudentProfile"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    guardians?: StudentGuardianListRelationFilter
    ranks?: StudentRankListRelationFilter
    attendances?: AttendanceListRelationFilter
    updateRequests?: ProfileUpdateRequestListRelationFilter
    promotionRequests?: PromotionRequestListRelationFilter
    subscriptions?: StudentSubscriptionListRelationFilter
    licenses?: StudentLicenseListRelationFilter
  }, "id" | "userId">

  export type StudentProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    birthDate?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StudentProfileCountOrderByAggregateInput
    _max?: StudentProfileMaxOrderByAggregateInput
    _min?: StudentProfileMinOrderByAggregateInput
  }

  export type StudentProfileScalarWhereWithAggregatesInput = {
    AND?: StudentProfileScalarWhereWithAggregatesInput | StudentProfileScalarWhereWithAggregatesInput[]
    OR?: StudentProfileScalarWhereWithAggregatesInput[]
    NOT?: StudentProfileScalarWhereWithAggregatesInput | StudentProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudentProfile"> | string
    userId?: StringWithAggregatesFilter<"StudentProfile"> | string
    birthDate?: DateTimeNullableWithAggregatesFilter<"StudentProfile"> | Date | string | null
    phone?: StringNullableWithAggregatesFilter<"StudentProfile"> | string | null
    address?: StringNullableWithAggregatesFilter<"StudentProfile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StudentProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"StudentProfile"> | Date | string
  }

  export type GuardianWhereInput = {
    AND?: GuardianWhereInput | GuardianWhereInput[]
    OR?: GuardianWhereInput[]
    NOT?: GuardianWhereInput | GuardianWhereInput[]
    id?: StringFilter<"Guardian"> | string
    userId?: StringFilter<"Guardian"> | string
    createdAt?: DateTimeFilter<"Guardian"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    students?: StudentGuardianListRelationFilter
  }

  export type GuardianOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    students?: StudentGuardianOrderByRelationAggregateInput
  }

  export type GuardianWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: GuardianWhereInput | GuardianWhereInput[]
    OR?: GuardianWhereInput[]
    NOT?: GuardianWhereInput | GuardianWhereInput[]
    createdAt?: DateTimeFilter<"Guardian"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    students?: StudentGuardianListRelationFilter
  }, "id" | "userId">

  export type GuardianOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    _count?: GuardianCountOrderByAggregateInput
    _max?: GuardianMaxOrderByAggregateInput
    _min?: GuardianMinOrderByAggregateInput
  }

  export type GuardianScalarWhereWithAggregatesInput = {
    AND?: GuardianScalarWhereWithAggregatesInput | GuardianScalarWhereWithAggregatesInput[]
    OR?: GuardianScalarWhereWithAggregatesInput[]
    NOT?: GuardianScalarWhereWithAggregatesInput | GuardianScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Guardian"> | string
    userId?: StringWithAggregatesFilter<"Guardian"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Guardian"> | Date | string
  }

  export type StudentGuardianWhereInput = {
    AND?: StudentGuardianWhereInput | StudentGuardianWhereInput[]
    OR?: StudentGuardianWhereInput[]
    NOT?: StudentGuardianWhereInput | StudentGuardianWhereInput[]
    studentProfileId?: StringFilter<"StudentGuardian"> | string
    guardianId?: StringFilter<"StudentGuardian"> | string
    relationship?: StringNullableFilter<"StudentGuardian"> | string | null
    student?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    guardian?: XOR<GuardianRelationFilter, GuardianWhereInput>
  }

  export type StudentGuardianOrderByWithRelationInput = {
    studentProfileId?: SortOrder
    guardianId?: SortOrder
    relationship?: SortOrderInput | SortOrder
    student?: StudentProfileOrderByWithRelationInput
    guardian?: GuardianOrderByWithRelationInput
  }

  export type StudentGuardianWhereUniqueInput = Prisma.AtLeast<{
    studentProfileId_guardianId?: StudentGuardianStudentProfileIdGuardianIdCompoundUniqueInput
    AND?: StudentGuardianWhereInput | StudentGuardianWhereInput[]
    OR?: StudentGuardianWhereInput[]
    NOT?: StudentGuardianWhereInput | StudentGuardianWhereInput[]
    studentProfileId?: StringFilter<"StudentGuardian"> | string
    guardianId?: StringFilter<"StudentGuardian"> | string
    relationship?: StringNullableFilter<"StudentGuardian"> | string | null
    student?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    guardian?: XOR<GuardianRelationFilter, GuardianWhereInput>
  }, "studentProfileId_guardianId">

  export type StudentGuardianOrderByWithAggregationInput = {
    studentProfileId?: SortOrder
    guardianId?: SortOrder
    relationship?: SortOrderInput | SortOrder
    _count?: StudentGuardianCountOrderByAggregateInput
    _max?: StudentGuardianMaxOrderByAggregateInput
    _min?: StudentGuardianMinOrderByAggregateInput
  }

  export type StudentGuardianScalarWhereWithAggregatesInput = {
    AND?: StudentGuardianScalarWhereWithAggregatesInput | StudentGuardianScalarWhereWithAggregatesInput[]
    OR?: StudentGuardianScalarWhereWithAggregatesInput[]
    NOT?: StudentGuardianScalarWhereWithAggregatesInput | StudentGuardianScalarWhereWithAggregatesInput[]
    studentProfileId?: StringWithAggregatesFilter<"StudentGuardian"> | string
    guardianId?: StringWithAggregatesFilter<"StudentGuardian"> | string
    relationship?: StringNullableWithAggregatesFilter<"StudentGuardian"> | string | null
  }

  export type DisciplineWhereInput = {
    AND?: DisciplineWhereInput | DisciplineWhereInput[]
    OR?: DisciplineWhereInput[]
    NOT?: DisciplineWhereInput | DisciplineWhereInput[]
    id?: StringFilter<"Discipline"> | string
    name?: StringFilter<"Discipline"> | string
    description?: StringNullableFilter<"Discipline"> | string | null
    programs?: DisciplineProgramListRelationFilter
  }

  export type DisciplineOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    programs?: DisciplineProgramOrderByRelationAggregateInput
  }

  export type DisciplineWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: DisciplineWhereInput | DisciplineWhereInput[]
    OR?: DisciplineWhereInput[]
    NOT?: DisciplineWhereInput | DisciplineWhereInput[]
    description?: StringNullableFilter<"Discipline"> | string | null
    programs?: DisciplineProgramListRelationFilter
  }, "id" | "name">

  export type DisciplineOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: DisciplineCountOrderByAggregateInput
    _max?: DisciplineMaxOrderByAggregateInput
    _min?: DisciplineMinOrderByAggregateInput
  }

  export type DisciplineScalarWhereWithAggregatesInput = {
    AND?: DisciplineScalarWhereWithAggregatesInput | DisciplineScalarWhereWithAggregatesInput[]
    OR?: DisciplineScalarWhereWithAggregatesInput[]
    NOT?: DisciplineScalarWhereWithAggregatesInput | DisciplineScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Discipline"> | string
    name?: StringWithAggregatesFilter<"Discipline"> | string
    description?: StringNullableWithAggregatesFilter<"Discipline"> | string | null
  }

  export type DisciplineProgramWhereInput = {
    AND?: DisciplineProgramWhereInput | DisciplineProgramWhereInput[]
    OR?: DisciplineProgramWhereInput[]
    NOT?: DisciplineProgramWhereInput | DisciplineProgramWhereInput[]
    id?: StringFilter<"DisciplineProgram"> | string
    disciplineId?: StringFilter<"DisciplineProgram"> | string
    name?: StringFilter<"DisciplineProgram"> | string
    minAge?: IntFilter<"DisciplineProgram"> | number
    maxAge?: IntFilter<"DisciplineProgram"> | number
    discipline?: XOR<DisciplineRelationFilter, DisciplineWhereInput>
    beltRanks?: BeltRankListRelationFilter
  }

  export type DisciplineProgramOrderByWithRelationInput = {
    id?: SortOrder
    disciplineId?: SortOrder
    name?: SortOrder
    minAge?: SortOrder
    maxAge?: SortOrder
    discipline?: DisciplineOrderByWithRelationInput
    beltRanks?: BeltRankOrderByRelationAggregateInput
  }

  export type DisciplineProgramWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DisciplineProgramWhereInput | DisciplineProgramWhereInput[]
    OR?: DisciplineProgramWhereInput[]
    NOT?: DisciplineProgramWhereInput | DisciplineProgramWhereInput[]
    disciplineId?: StringFilter<"DisciplineProgram"> | string
    name?: StringFilter<"DisciplineProgram"> | string
    minAge?: IntFilter<"DisciplineProgram"> | number
    maxAge?: IntFilter<"DisciplineProgram"> | number
    discipline?: XOR<DisciplineRelationFilter, DisciplineWhereInput>
    beltRanks?: BeltRankListRelationFilter
  }, "id">

  export type DisciplineProgramOrderByWithAggregationInput = {
    id?: SortOrder
    disciplineId?: SortOrder
    name?: SortOrder
    minAge?: SortOrder
    maxAge?: SortOrder
    _count?: DisciplineProgramCountOrderByAggregateInput
    _avg?: DisciplineProgramAvgOrderByAggregateInput
    _max?: DisciplineProgramMaxOrderByAggregateInput
    _min?: DisciplineProgramMinOrderByAggregateInput
    _sum?: DisciplineProgramSumOrderByAggregateInput
  }

  export type DisciplineProgramScalarWhereWithAggregatesInput = {
    AND?: DisciplineProgramScalarWhereWithAggregatesInput | DisciplineProgramScalarWhereWithAggregatesInput[]
    OR?: DisciplineProgramScalarWhereWithAggregatesInput[]
    NOT?: DisciplineProgramScalarWhereWithAggregatesInput | DisciplineProgramScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DisciplineProgram"> | string
    disciplineId?: StringWithAggregatesFilter<"DisciplineProgram"> | string
    name?: StringWithAggregatesFilter<"DisciplineProgram"> | string
    minAge?: IntWithAggregatesFilter<"DisciplineProgram"> | number
    maxAge?: IntWithAggregatesFilter<"DisciplineProgram"> | number
  }

  export type BeltRankWhereInput = {
    AND?: BeltRankWhereInput | BeltRankWhereInput[]
    OR?: BeltRankWhereInput[]
    NOT?: BeltRankWhereInput | BeltRankWhereInput[]
    id?: StringFilter<"BeltRank"> | string
    disciplineProgramId?: StringFilter<"BeltRank"> | string
    name?: StringFilter<"BeltRank"> | string
    order?: IntFilter<"BeltRank"> | number
    maxStripes?: IntFilter<"BeltRank"> | number
    minMonthsRequired?: IntFilter<"BeltRank"> | number
    minHoursRequired?: IntFilter<"BeltRank"> | number
    program?: XOR<DisciplineProgramRelationFilter, DisciplineProgramWhereInput>
    studentRanks?: StudentRankListRelationFilter
  }

  export type BeltRankOrderByWithRelationInput = {
    id?: SortOrder
    disciplineProgramId?: SortOrder
    name?: SortOrder
    order?: SortOrder
    maxStripes?: SortOrder
    minMonthsRequired?: SortOrder
    minHoursRequired?: SortOrder
    program?: DisciplineProgramOrderByWithRelationInput
    studentRanks?: StudentRankOrderByRelationAggregateInput
  }

  export type BeltRankWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BeltRankWhereInput | BeltRankWhereInput[]
    OR?: BeltRankWhereInput[]
    NOT?: BeltRankWhereInput | BeltRankWhereInput[]
    disciplineProgramId?: StringFilter<"BeltRank"> | string
    name?: StringFilter<"BeltRank"> | string
    order?: IntFilter<"BeltRank"> | number
    maxStripes?: IntFilter<"BeltRank"> | number
    minMonthsRequired?: IntFilter<"BeltRank"> | number
    minHoursRequired?: IntFilter<"BeltRank"> | number
    program?: XOR<DisciplineProgramRelationFilter, DisciplineProgramWhereInput>
    studentRanks?: StudentRankListRelationFilter
  }, "id">

  export type BeltRankOrderByWithAggregationInput = {
    id?: SortOrder
    disciplineProgramId?: SortOrder
    name?: SortOrder
    order?: SortOrder
    maxStripes?: SortOrder
    minMonthsRequired?: SortOrder
    minHoursRequired?: SortOrder
    _count?: BeltRankCountOrderByAggregateInput
    _avg?: BeltRankAvgOrderByAggregateInput
    _max?: BeltRankMaxOrderByAggregateInput
    _min?: BeltRankMinOrderByAggregateInput
    _sum?: BeltRankSumOrderByAggregateInput
  }

  export type BeltRankScalarWhereWithAggregatesInput = {
    AND?: BeltRankScalarWhereWithAggregatesInput | BeltRankScalarWhereWithAggregatesInput[]
    OR?: BeltRankScalarWhereWithAggregatesInput[]
    NOT?: BeltRankScalarWhereWithAggregatesInput | BeltRankScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BeltRank"> | string
    disciplineProgramId?: StringWithAggregatesFilter<"BeltRank"> | string
    name?: StringWithAggregatesFilter<"BeltRank"> | string
    order?: IntWithAggregatesFilter<"BeltRank"> | number
    maxStripes?: IntWithAggregatesFilter<"BeltRank"> | number
    minMonthsRequired?: IntWithAggregatesFilter<"BeltRank"> | number
    minHoursRequired?: IntWithAggregatesFilter<"BeltRank"> | number
  }

  export type StudentRankWhereInput = {
    AND?: StudentRankWhereInput | StudentRankWhereInput[]
    OR?: StudentRankWhereInput[]
    NOT?: StudentRankWhereInput | StudentRankWhereInput[]
    id?: StringFilter<"StudentRank"> | string
    studentProfileId?: StringFilter<"StudentRank"> | string
    beltRankId?: StringFilter<"StudentRank"> | string
    currentStripes?: IntFilter<"StudentRank"> | number
    accumulatedHours?: IntFilter<"StudentRank"> | number
    promotedAt?: DateTimeFilter<"StudentRank"> | Date | string
    lastStripeAt?: DateTimeFilter<"StudentRank"> | Date | string
    student?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    beltRank?: XOR<BeltRankRelationFilter, BeltRankWhereInput>
  }

  export type StudentRankOrderByWithRelationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    beltRankId?: SortOrder
    currentStripes?: SortOrder
    accumulatedHours?: SortOrder
    promotedAt?: SortOrder
    lastStripeAt?: SortOrder
    student?: StudentProfileOrderByWithRelationInput
    beltRank?: BeltRankOrderByWithRelationInput
  }

  export type StudentRankWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StudentRankWhereInput | StudentRankWhereInput[]
    OR?: StudentRankWhereInput[]
    NOT?: StudentRankWhereInput | StudentRankWhereInput[]
    studentProfileId?: StringFilter<"StudentRank"> | string
    beltRankId?: StringFilter<"StudentRank"> | string
    currentStripes?: IntFilter<"StudentRank"> | number
    accumulatedHours?: IntFilter<"StudentRank"> | number
    promotedAt?: DateTimeFilter<"StudentRank"> | Date | string
    lastStripeAt?: DateTimeFilter<"StudentRank"> | Date | string
    student?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    beltRank?: XOR<BeltRankRelationFilter, BeltRankWhereInput>
  }, "id">

  export type StudentRankOrderByWithAggregationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    beltRankId?: SortOrder
    currentStripes?: SortOrder
    accumulatedHours?: SortOrder
    promotedAt?: SortOrder
    lastStripeAt?: SortOrder
    _count?: StudentRankCountOrderByAggregateInput
    _avg?: StudentRankAvgOrderByAggregateInput
    _max?: StudentRankMaxOrderByAggregateInput
    _min?: StudentRankMinOrderByAggregateInput
    _sum?: StudentRankSumOrderByAggregateInput
  }

  export type StudentRankScalarWhereWithAggregatesInput = {
    AND?: StudentRankScalarWhereWithAggregatesInput | StudentRankScalarWhereWithAggregatesInput[]
    OR?: StudentRankScalarWhereWithAggregatesInput[]
    NOT?: StudentRankScalarWhereWithAggregatesInput | StudentRankScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudentRank"> | string
    studentProfileId?: StringWithAggregatesFilter<"StudentRank"> | string
    beltRankId?: StringWithAggregatesFilter<"StudentRank"> | string
    currentStripes?: IntWithAggregatesFilter<"StudentRank"> | number
    accumulatedHours?: IntWithAggregatesFilter<"StudentRank"> | number
    promotedAt?: DateTimeWithAggregatesFilter<"StudentRank"> | Date | string
    lastStripeAt?: DateTimeWithAggregatesFilter<"StudentRank"> | Date | string
  }

  export type AttendanceWhereInput = {
    AND?: AttendanceWhereInput | AttendanceWhereInput[]
    OR?: AttendanceWhereInput[]
    NOT?: AttendanceWhereInput | AttendanceWhereInput[]
    id?: StringFilter<"Attendance"> | string
    studentProfileId?: StringFilter<"Attendance"> | string
    date?: DateTimeFilter<"Attendance"> | Date | string
    countedForRank?: BoolFilter<"Attendance"> | boolean
    student?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
  }

  export type AttendanceOrderByWithRelationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    date?: SortOrder
    countedForRank?: SortOrder
    student?: StudentProfileOrderByWithRelationInput
  }

  export type AttendanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AttendanceWhereInput | AttendanceWhereInput[]
    OR?: AttendanceWhereInput[]
    NOT?: AttendanceWhereInput | AttendanceWhereInput[]
    studentProfileId?: StringFilter<"Attendance"> | string
    date?: DateTimeFilter<"Attendance"> | Date | string
    countedForRank?: BoolFilter<"Attendance"> | boolean
    student?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
  }, "id">

  export type AttendanceOrderByWithAggregationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    date?: SortOrder
    countedForRank?: SortOrder
    _count?: AttendanceCountOrderByAggregateInput
    _max?: AttendanceMaxOrderByAggregateInput
    _min?: AttendanceMinOrderByAggregateInput
  }

  export type AttendanceScalarWhereWithAggregatesInput = {
    AND?: AttendanceScalarWhereWithAggregatesInput | AttendanceScalarWhereWithAggregatesInput[]
    OR?: AttendanceScalarWhereWithAggregatesInput[]
    NOT?: AttendanceScalarWhereWithAggregatesInput | AttendanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Attendance"> | string
    studentProfileId?: StringWithAggregatesFilter<"Attendance"> | string
    date?: DateTimeWithAggregatesFilter<"Attendance"> | Date | string
    countedForRank?: BoolWithAggregatesFilter<"Attendance"> | boolean
  }

  export type ProfileUpdateRequestWhereInput = {
    AND?: ProfileUpdateRequestWhereInput | ProfileUpdateRequestWhereInput[]
    OR?: ProfileUpdateRequestWhereInput[]
    NOT?: ProfileUpdateRequestWhereInput | ProfileUpdateRequestWhereInput[]
    id?: StringFilter<"ProfileUpdateRequest"> | string
    studentProfileId?: StringFilter<"ProfileUpdateRequest"> | string
    requestedChanges?: JsonFilter<"ProfileUpdateRequest">
    status?: EnumRequestStatusFilter<"ProfileUpdateRequest"> | $Enums.RequestStatus
    reviewedById?: StringNullableFilter<"ProfileUpdateRequest"> | string | null
    createdAt?: DateTimeFilter<"ProfileUpdateRequest"> | Date | string
    updatedAt?: DateTimeFilter<"ProfileUpdateRequest"> | Date | string
    studentProfile?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    reviewer?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type ProfileUpdateRequestOrderByWithRelationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    requestedChanges?: SortOrder
    status?: SortOrder
    reviewedById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    studentProfile?: StudentProfileOrderByWithRelationInput
    reviewer?: UserOrderByWithRelationInput
  }

  export type ProfileUpdateRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProfileUpdateRequestWhereInput | ProfileUpdateRequestWhereInput[]
    OR?: ProfileUpdateRequestWhereInput[]
    NOT?: ProfileUpdateRequestWhereInput | ProfileUpdateRequestWhereInput[]
    studentProfileId?: StringFilter<"ProfileUpdateRequest"> | string
    requestedChanges?: JsonFilter<"ProfileUpdateRequest">
    status?: EnumRequestStatusFilter<"ProfileUpdateRequest"> | $Enums.RequestStatus
    reviewedById?: StringNullableFilter<"ProfileUpdateRequest"> | string | null
    createdAt?: DateTimeFilter<"ProfileUpdateRequest"> | Date | string
    updatedAt?: DateTimeFilter<"ProfileUpdateRequest"> | Date | string
    studentProfile?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    reviewer?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type ProfileUpdateRequestOrderByWithAggregationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    requestedChanges?: SortOrder
    status?: SortOrder
    reviewedById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProfileUpdateRequestCountOrderByAggregateInput
    _max?: ProfileUpdateRequestMaxOrderByAggregateInput
    _min?: ProfileUpdateRequestMinOrderByAggregateInput
  }

  export type ProfileUpdateRequestScalarWhereWithAggregatesInput = {
    AND?: ProfileUpdateRequestScalarWhereWithAggregatesInput | ProfileUpdateRequestScalarWhereWithAggregatesInput[]
    OR?: ProfileUpdateRequestScalarWhereWithAggregatesInput[]
    NOT?: ProfileUpdateRequestScalarWhereWithAggregatesInput | ProfileUpdateRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProfileUpdateRequest"> | string
    studentProfileId?: StringWithAggregatesFilter<"ProfileUpdateRequest"> | string
    requestedChanges?: JsonWithAggregatesFilter<"ProfileUpdateRequest">
    status?: EnumRequestStatusWithAggregatesFilter<"ProfileUpdateRequest"> | $Enums.RequestStatus
    reviewedById?: StringNullableWithAggregatesFilter<"ProfileUpdateRequest"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProfileUpdateRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProfileUpdateRequest"> | Date | string
  }

  export type PromotionRequestWhereInput = {
    AND?: PromotionRequestWhereInput | PromotionRequestWhereInput[]
    OR?: PromotionRequestWhereInput[]
    NOT?: PromotionRequestWhereInput | PromotionRequestWhereInput[]
    id?: StringFilter<"PromotionRequest"> | string
    studentProfileId?: StringFilter<"PromotionRequest"> | string
    proposedBeltId?: StringNullableFilter<"PromotionRequest"> | string | null
    proposedStripes?: IntNullableFilter<"PromotionRequest"> | number | null
    proposedById?: StringFilter<"PromotionRequest"> | string
    approvedById?: StringNullableFilter<"PromotionRequest"> | string | null
    status?: EnumRequestStatusFilter<"PromotionRequest"> | $Enums.RequestStatus
    createdAt?: DateTimeFilter<"PromotionRequest"> | Date | string
    studentProfile?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    proposedBy?: XOR<UserRelationFilter, UserWhereInput>
    approvedBy?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type PromotionRequestOrderByWithRelationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    proposedBeltId?: SortOrderInput | SortOrder
    proposedStripes?: SortOrderInput | SortOrder
    proposedById?: SortOrder
    approvedById?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    studentProfile?: StudentProfileOrderByWithRelationInput
    proposedBy?: UserOrderByWithRelationInput
    approvedBy?: UserOrderByWithRelationInput
  }

  export type PromotionRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PromotionRequestWhereInput | PromotionRequestWhereInput[]
    OR?: PromotionRequestWhereInput[]
    NOT?: PromotionRequestWhereInput | PromotionRequestWhereInput[]
    studentProfileId?: StringFilter<"PromotionRequest"> | string
    proposedBeltId?: StringNullableFilter<"PromotionRequest"> | string | null
    proposedStripes?: IntNullableFilter<"PromotionRequest"> | number | null
    proposedById?: StringFilter<"PromotionRequest"> | string
    approvedById?: StringNullableFilter<"PromotionRequest"> | string | null
    status?: EnumRequestStatusFilter<"PromotionRequest"> | $Enums.RequestStatus
    createdAt?: DateTimeFilter<"PromotionRequest"> | Date | string
    studentProfile?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    proposedBy?: XOR<UserRelationFilter, UserWhereInput>
    approvedBy?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type PromotionRequestOrderByWithAggregationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    proposedBeltId?: SortOrderInput | SortOrder
    proposedStripes?: SortOrderInput | SortOrder
    proposedById?: SortOrder
    approvedById?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: PromotionRequestCountOrderByAggregateInput
    _avg?: PromotionRequestAvgOrderByAggregateInput
    _max?: PromotionRequestMaxOrderByAggregateInput
    _min?: PromotionRequestMinOrderByAggregateInput
    _sum?: PromotionRequestSumOrderByAggregateInput
  }

  export type PromotionRequestScalarWhereWithAggregatesInput = {
    AND?: PromotionRequestScalarWhereWithAggregatesInput | PromotionRequestScalarWhereWithAggregatesInput[]
    OR?: PromotionRequestScalarWhereWithAggregatesInput[]
    NOT?: PromotionRequestScalarWhereWithAggregatesInput | PromotionRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PromotionRequest"> | string
    studentProfileId?: StringWithAggregatesFilter<"PromotionRequest"> | string
    proposedBeltId?: StringNullableWithAggregatesFilter<"PromotionRequest"> | string | null
    proposedStripes?: IntNullableWithAggregatesFilter<"PromotionRequest"> | number | null
    proposedById?: StringWithAggregatesFilter<"PromotionRequest"> | string
    approvedById?: StringNullableWithAggregatesFilter<"PromotionRequest"> | string | null
    status?: EnumRequestStatusWithAggregatesFilter<"PromotionRequest"> | $Enums.RequestStatus
    createdAt?: DateTimeWithAggregatesFilter<"PromotionRequest"> | Date | string
  }

  export type FeePlanWhereInput = {
    AND?: FeePlanWhereInput | FeePlanWhereInput[]
    OR?: FeePlanWhereInput[]
    NOT?: FeePlanWhereInput | FeePlanWhereInput[]
    id?: StringFilter<"FeePlan"> | string
    name?: StringFilter<"FeePlan"> | string
    monthlyPrice?: FloatFilter<"FeePlan"> | number
    subscriptions?: StudentSubscriptionListRelationFilter
  }

  export type FeePlanOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    monthlyPrice?: SortOrder
    subscriptions?: StudentSubscriptionOrderByRelationAggregateInput
  }

  export type FeePlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FeePlanWhereInput | FeePlanWhereInput[]
    OR?: FeePlanWhereInput[]
    NOT?: FeePlanWhereInput | FeePlanWhereInput[]
    name?: StringFilter<"FeePlan"> | string
    monthlyPrice?: FloatFilter<"FeePlan"> | number
    subscriptions?: StudentSubscriptionListRelationFilter
  }, "id">

  export type FeePlanOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    monthlyPrice?: SortOrder
    _count?: FeePlanCountOrderByAggregateInput
    _avg?: FeePlanAvgOrderByAggregateInput
    _max?: FeePlanMaxOrderByAggregateInput
    _min?: FeePlanMinOrderByAggregateInput
    _sum?: FeePlanSumOrderByAggregateInput
  }

  export type FeePlanScalarWhereWithAggregatesInput = {
    AND?: FeePlanScalarWhereWithAggregatesInput | FeePlanScalarWhereWithAggregatesInput[]
    OR?: FeePlanScalarWhereWithAggregatesInput[]
    NOT?: FeePlanScalarWhereWithAggregatesInput | FeePlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FeePlan"> | string
    name?: StringWithAggregatesFilter<"FeePlan"> | string
    monthlyPrice?: FloatWithAggregatesFilter<"FeePlan"> | number
  }

  export type StudentSubscriptionWhereInput = {
    AND?: StudentSubscriptionWhereInput | StudentSubscriptionWhereInput[]
    OR?: StudentSubscriptionWhereInput[]
    NOT?: StudentSubscriptionWhereInput | StudentSubscriptionWhereInput[]
    id?: StringFilter<"StudentSubscription"> | string
    studentProfileId?: StringFilter<"StudentSubscription"> | string
    feePlanId?: StringFilter<"StudentSubscription"> | string
    isActive?: BoolFilter<"StudentSubscription"> | boolean
    mandateReference?: StringNullableFilter<"StudentSubscription"> | string | null
    student?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    feePlan?: XOR<FeePlanRelationFilter, FeePlanWhereInput>
  }

  export type StudentSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    feePlanId?: SortOrder
    isActive?: SortOrder
    mandateReference?: SortOrderInput | SortOrder
    student?: StudentProfileOrderByWithRelationInput
    feePlan?: FeePlanOrderByWithRelationInput
  }

  export type StudentSubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StudentSubscriptionWhereInput | StudentSubscriptionWhereInput[]
    OR?: StudentSubscriptionWhereInput[]
    NOT?: StudentSubscriptionWhereInput | StudentSubscriptionWhereInput[]
    studentProfileId?: StringFilter<"StudentSubscription"> | string
    feePlanId?: StringFilter<"StudentSubscription"> | string
    isActive?: BoolFilter<"StudentSubscription"> | boolean
    mandateReference?: StringNullableFilter<"StudentSubscription"> | string | null
    student?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    feePlan?: XOR<FeePlanRelationFilter, FeePlanWhereInput>
  }, "id">

  export type StudentSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    feePlanId?: SortOrder
    isActive?: SortOrder
    mandateReference?: SortOrderInput | SortOrder
    _count?: StudentSubscriptionCountOrderByAggregateInput
    _max?: StudentSubscriptionMaxOrderByAggregateInput
    _min?: StudentSubscriptionMinOrderByAggregateInput
  }

  export type StudentSubscriptionScalarWhereWithAggregatesInput = {
    AND?: StudentSubscriptionScalarWhereWithAggregatesInput | StudentSubscriptionScalarWhereWithAggregatesInput[]
    OR?: StudentSubscriptionScalarWhereWithAggregatesInput[]
    NOT?: StudentSubscriptionScalarWhereWithAggregatesInput | StudentSubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudentSubscription"> | string
    studentProfileId?: StringWithAggregatesFilter<"StudentSubscription"> | string
    feePlanId?: StringWithAggregatesFilter<"StudentSubscription"> | string
    isActive?: BoolWithAggregatesFilter<"StudentSubscription"> | boolean
    mandateReference?: StringNullableWithAggregatesFilter<"StudentSubscription"> | string | null
  }

  export type FederationWhereInput = {
    AND?: FederationWhereInput | FederationWhereInput[]
    OR?: FederationWhereInput[]
    NOT?: FederationWhereInput | FederationWhereInput[]
    id?: StringFilter<"Federation"> | string
    name?: StringFilter<"Federation"> | string
    country?: StringFilter<"Federation"> | string
    licenses?: StudentLicenseListRelationFilter
  }

  export type FederationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    country?: SortOrder
    licenses?: StudentLicenseOrderByRelationAggregateInput
  }

  export type FederationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FederationWhereInput | FederationWhereInput[]
    OR?: FederationWhereInput[]
    NOT?: FederationWhereInput | FederationWhereInput[]
    name?: StringFilter<"Federation"> | string
    country?: StringFilter<"Federation"> | string
    licenses?: StudentLicenseListRelationFilter
  }, "id">

  export type FederationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    country?: SortOrder
    _count?: FederationCountOrderByAggregateInput
    _max?: FederationMaxOrderByAggregateInput
    _min?: FederationMinOrderByAggregateInput
  }

  export type FederationScalarWhereWithAggregatesInput = {
    AND?: FederationScalarWhereWithAggregatesInput | FederationScalarWhereWithAggregatesInput[]
    OR?: FederationScalarWhereWithAggregatesInput[]
    NOT?: FederationScalarWhereWithAggregatesInput | FederationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Federation"> | string
    name?: StringWithAggregatesFilter<"Federation"> | string
    country?: StringWithAggregatesFilter<"Federation"> | string
  }

  export type StudentLicenseWhereInput = {
    AND?: StudentLicenseWhereInput | StudentLicenseWhereInput[]
    OR?: StudentLicenseWhereInput[]
    NOT?: StudentLicenseWhereInput | StudentLicenseWhereInput[]
    id?: StringFilter<"StudentLicense"> | string
    studentProfileId?: StringFilter<"StudentLicense"> | string
    federationId?: StringFilter<"StudentLicense"> | string
    licenseNumber?: StringFilter<"StudentLicense"> | string
    validUntil?: DateTimeFilter<"StudentLicense"> | Date | string
    isActive?: BoolFilter<"StudentLicense"> | boolean
    student?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    federation?: XOR<FederationRelationFilter, FederationWhereInput>
  }

  export type StudentLicenseOrderByWithRelationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    federationId?: SortOrder
    licenseNumber?: SortOrder
    validUntil?: SortOrder
    isActive?: SortOrder
    student?: StudentProfileOrderByWithRelationInput
    federation?: FederationOrderByWithRelationInput
  }

  export type StudentLicenseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StudentLicenseWhereInput | StudentLicenseWhereInput[]
    OR?: StudentLicenseWhereInput[]
    NOT?: StudentLicenseWhereInput | StudentLicenseWhereInput[]
    studentProfileId?: StringFilter<"StudentLicense"> | string
    federationId?: StringFilter<"StudentLicense"> | string
    licenseNumber?: StringFilter<"StudentLicense"> | string
    validUntil?: DateTimeFilter<"StudentLicense"> | Date | string
    isActive?: BoolFilter<"StudentLicense"> | boolean
    student?: XOR<StudentProfileRelationFilter, StudentProfileWhereInput>
    federation?: XOR<FederationRelationFilter, FederationWhereInput>
  }, "id">

  export type StudentLicenseOrderByWithAggregationInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    federationId?: SortOrder
    licenseNumber?: SortOrder
    validUntil?: SortOrder
    isActive?: SortOrder
    _count?: StudentLicenseCountOrderByAggregateInput
    _max?: StudentLicenseMaxOrderByAggregateInput
    _min?: StudentLicenseMinOrderByAggregateInput
  }

  export type StudentLicenseScalarWhereWithAggregatesInput = {
    AND?: StudentLicenseScalarWhereWithAggregatesInput | StudentLicenseScalarWhereWithAggregatesInput[]
    OR?: StudentLicenseScalarWhereWithAggregatesInput[]
    NOT?: StudentLicenseScalarWhereWithAggregatesInput | StudentLicenseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StudentLicense"> | string
    studentProfileId?: StringWithAggregatesFilter<"StudentLicense"> | string
    federationId?: StringWithAggregatesFilter<"StudentLicense"> | string
    licenseNumber?: StringWithAggregatesFilter<"StudentLicense"> | string
    validUntil?: DateTimeWithAggregatesFilter<"StudentLicense"> | Date | string
    isActive?: BoolWithAggregatesFilter<"StudentLicense"> | boolean
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    guardianProfile?: GuardianCreateNestedOneWithoutUserInput
    reviewedUpdates?: ProfileUpdateRequestCreateNestedManyWithoutReviewerInput
    proposedPromotions?: PromotionRequestCreateNestedManyWithoutProposedByInput
    approvedPromotions?: PromotionRequestCreateNestedManyWithoutApprovedByInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    guardianProfile?: GuardianUncheckedCreateNestedOneWithoutUserInput
    reviewedUpdates?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutReviewerInput
    proposedPromotions?: PromotionRequestUncheckedCreateNestedManyWithoutProposedByInput
    approvedPromotions?: PromotionRequestUncheckedCreateNestedManyWithoutApprovedByInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    guardianProfile?: GuardianUpdateOneWithoutUserNestedInput
    reviewedUpdates?: ProfileUpdateRequestUpdateManyWithoutReviewerNestedInput
    proposedPromotions?: PromotionRequestUpdateManyWithoutProposedByNestedInput
    approvedPromotions?: PromotionRequestUpdateManyWithoutApprovedByNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    guardianProfile?: GuardianUncheckedUpdateOneWithoutUserNestedInput
    reviewedUpdates?: ProfileUpdateRequestUncheckedUpdateManyWithoutReviewerNestedInput
    proposedPromotions?: PromotionRequestUncheckedUpdateManyWithoutProposedByNestedInput
    approvedPromotions?: PromotionRequestUncheckedUpdateManyWithoutApprovedByNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentProfileCreateInput = {
    id?: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentProfileInput
    guardians?: StudentGuardianCreateNestedManyWithoutStudentInput
    ranks?: StudentRankCreateNestedManyWithoutStudentInput
    attendances?: AttendanceCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileUncheckedCreateInput = {
    id?: string
    userId: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    guardians?: StudentGuardianUncheckedCreateNestedManyWithoutStudentInput
    ranks?: StudentRankUncheckedCreateNestedManyWithoutStudentInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionUncheckedCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentProfileNestedInput
    guardians?: StudentGuardianUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guardians?: StudentGuardianUncheckedUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUncheckedUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUncheckedUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileCreateManyInput = {
    id?: string
    userId: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuardianCreateInput = {
    id?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutGuardianProfileInput
    students?: StudentGuardianCreateNestedManyWithoutGuardianInput
  }

  export type GuardianUncheckedCreateInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    students?: StudentGuardianUncheckedCreateNestedManyWithoutGuardianInput
  }

  export type GuardianUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGuardianProfileNestedInput
    students?: StudentGuardianUpdateManyWithoutGuardianNestedInput
  }

  export type GuardianUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentGuardianUncheckedUpdateManyWithoutGuardianNestedInput
  }

  export type GuardianCreateManyInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type GuardianUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GuardianUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentGuardianCreateInput = {
    relationship?: string | null
    student: StudentProfileCreateNestedOneWithoutGuardiansInput
    guardian: GuardianCreateNestedOneWithoutStudentsInput
  }

  export type StudentGuardianUncheckedCreateInput = {
    studentProfileId: string
    guardianId: string
    relationship?: string | null
  }

  export type StudentGuardianUpdateInput = {
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    student?: StudentProfileUpdateOneRequiredWithoutGuardiansNestedInput
    guardian?: GuardianUpdateOneRequiredWithoutStudentsNestedInput
  }

  export type StudentGuardianUncheckedUpdateInput = {
    studentProfileId?: StringFieldUpdateOperationsInput | string
    guardianId?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StudentGuardianCreateManyInput = {
    studentProfileId: string
    guardianId: string
    relationship?: string | null
  }

  export type StudentGuardianUpdateManyMutationInput = {
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StudentGuardianUncheckedUpdateManyInput = {
    studentProfileId?: StringFieldUpdateOperationsInput | string
    guardianId?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DisciplineCreateInput = {
    id?: string
    name: string
    description?: string | null
    programs?: DisciplineProgramCreateNestedManyWithoutDisciplineInput
  }

  export type DisciplineUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    programs?: DisciplineProgramUncheckedCreateNestedManyWithoutDisciplineInput
  }

  export type DisciplineUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    programs?: DisciplineProgramUpdateManyWithoutDisciplineNestedInput
  }

  export type DisciplineUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    programs?: DisciplineProgramUncheckedUpdateManyWithoutDisciplineNestedInput
  }

  export type DisciplineCreateManyInput = {
    id?: string
    name: string
    description?: string | null
  }

  export type DisciplineUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DisciplineUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DisciplineProgramCreateInput = {
    id?: string
    name: string
    minAge?: number
    maxAge?: number
    discipline: DisciplineCreateNestedOneWithoutProgramsInput
    beltRanks?: BeltRankCreateNestedManyWithoutProgramInput
  }

  export type DisciplineProgramUncheckedCreateInput = {
    id?: string
    disciplineId: string
    name: string
    minAge?: number
    maxAge?: number
    beltRanks?: BeltRankUncheckedCreateNestedManyWithoutProgramInput
  }

  export type DisciplineProgramUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    minAge?: IntFieldUpdateOperationsInput | number
    maxAge?: IntFieldUpdateOperationsInput | number
    discipline?: DisciplineUpdateOneRequiredWithoutProgramsNestedInput
    beltRanks?: BeltRankUpdateManyWithoutProgramNestedInput
  }

  export type DisciplineProgramUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    disciplineId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    minAge?: IntFieldUpdateOperationsInput | number
    maxAge?: IntFieldUpdateOperationsInput | number
    beltRanks?: BeltRankUncheckedUpdateManyWithoutProgramNestedInput
  }

  export type DisciplineProgramCreateManyInput = {
    id?: string
    disciplineId: string
    name: string
    minAge?: number
    maxAge?: number
  }

  export type DisciplineProgramUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    minAge?: IntFieldUpdateOperationsInput | number
    maxAge?: IntFieldUpdateOperationsInput | number
  }

  export type DisciplineProgramUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    disciplineId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    minAge?: IntFieldUpdateOperationsInput | number
    maxAge?: IntFieldUpdateOperationsInput | number
  }

  export type BeltRankCreateInput = {
    id?: string
    name: string
    order: number
    maxStripes?: number
    minMonthsRequired?: number
    minHoursRequired?: number
    program: DisciplineProgramCreateNestedOneWithoutBeltRanksInput
    studentRanks?: StudentRankCreateNestedManyWithoutBeltRankInput
  }

  export type BeltRankUncheckedCreateInput = {
    id?: string
    disciplineProgramId: string
    name: string
    order: number
    maxStripes?: number
    minMonthsRequired?: number
    minHoursRequired?: number
    studentRanks?: StudentRankUncheckedCreateNestedManyWithoutBeltRankInput
  }

  export type BeltRankUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    maxStripes?: IntFieldUpdateOperationsInput | number
    minMonthsRequired?: IntFieldUpdateOperationsInput | number
    minHoursRequired?: IntFieldUpdateOperationsInput | number
    program?: DisciplineProgramUpdateOneRequiredWithoutBeltRanksNestedInput
    studentRanks?: StudentRankUpdateManyWithoutBeltRankNestedInput
  }

  export type BeltRankUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    disciplineProgramId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    maxStripes?: IntFieldUpdateOperationsInput | number
    minMonthsRequired?: IntFieldUpdateOperationsInput | number
    minHoursRequired?: IntFieldUpdateOperationsInput | number
    studentRanks?: StudentRankUncheckedUpdateManyWithoutBeltRankNestedInput
  }

  export type BeltRankCreateManyInput = {
    id?: string
    disciplineProgramId: string
    name: string
    order: number
    maxStripes?: number
    minMonthsRequired?: number
    minHoursRequired?: number
  }

  export type BeltRankUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    maxStripes?: IntFieldUpdateOperationsInput | number
    minMonthsRequired?: IntFieldUpdateOperationsInput | number
    minHoursRequired?: IntFieldUpdateOperationsInput | number
  }

  export type BeltRankUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    disciplineProgramId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    maxStripes?: IntFieldUpdateOperationsInput | number
    minMonthsRequired?: IntFieldUpdateOperationsInput | number
    minHoursRequired?: IntFieldUpdateOperationsInput | number
  }

  export type StudentRankCreateInput = {
    id?: string
    currentStripes?: number
    accumulatedHours?: number
    promotedAt?: Date | string
    lastStripeAt?: Date | string
    student: StudentProfileCreateNestedOneWithoutRanksInput
    beltRank: BeltRankCreateNestedOneWithoutStudentRanksInput
  }

  export type StudentRankUncheckedCreateInput = {
    id?: string
    studentProfileId: string
    beltRankId: string
    currentStripes?: number
    accumulatedHours?: number
    promotedAt?: Date | string
    lastStripeAt?: Date | string
  }

  export type StudentRankUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStripes?: IntFieldUpdateOperationsInput | number
    accumulatedHours?: IntFieldUpdateOperationsInput | number
    promotedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastStripeAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentProfileUpdateOneRequiredWithoutRanksNestedInput
    beltRank?: BeltRankUpdateOneRequiredWithoutStudentRanksNestedInput
  }

  export type StudentRankUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    beltRankId?: StringFieldUpdateOperationsInput | string
    currentStripes?: IntFieldUpdateOperationsInput | number
    accumulatedHours?: IntFieldUpdateOperationsInput | number
    promotedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastStripeAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentRankCreateManyInput = {
    id?: string
    studentProfileId: string
    beltRankId: string
    currentStripes?: number
    accumulatedHours?: number
    promotedAt?: Date | string
    lastStripeAt?: Date | string
  }

  export type StudentRankUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStripes?: IntFieldUpdateOperationsInput | number
    accumulatedHours?: IntFieldUpdateOperationsInput | number
    promotedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastStripeAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentRankUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    beltRankId?: StringFieldUpdateOperationsInput | string
    currentStripes?: IntFieldUpdateOperationsInput | number
    accumulatedHours?: IntFieldUpdateOperationsInput | number
    promotedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastStripeAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceCreateInput = {
    id?: string
    date?: Date | string
    countedForRank?: boolean
    student: StudentProfileCreateNestedOneWithoutAttendancesInput
  }

  export type AttendanceUncheckedCreateInput = {
    id?: string
    studentProfileId: string
    date?: Date | string
    countedForRank?: boolean
  }

  export type AttendanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    countedForRank?: BoolFieldUpdateOperationsInput | boolean
    student?: StudentProfileUpdateOneRequiredWithoutAttendancesNestedInput
  }

  export type AttendanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    countedForRank?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AttendanceCreateManyInput = {
    id?: string
    studentProfileId: string
    date?: Date | string
    countedForRank?: boolean
  }

  export type AttendanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    countedForRank?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AttendanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    countedForRank?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProfileUpdateRequestCreateInput = {
    id?: string
    requestedChanges: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile: StudentProfileCreateNestedOneWithoutUpdateRequestsInput
    reviewer?: UserCreateNestedOneWithoutReviewedUpdatesInput
  }

  export type ProfileUpdateRequestUncheckedCreateInput = {
    id?: string
    studentProfileId: string
    requestedChanges: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    reviewedById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedChanges?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneRequiredWithoutUpdateRequestsNestedInput
    reviewer?: UserUpdateOneWithoutReviewedUpdatesNestedInput
  }

  export type ProfileUpdateRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    requestedChanges?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUpdateRequestCreateManyInput = {
    id?: string
    studentProfileId: string
    requestedChanges: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    reviewedById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedChanges?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUpdateRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    requestedChanges?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionRequestCreateInput = {
    id?: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    studentProfile: StudentProfileCreateNestedOneWithoutPromotionRequestsInput
    proposedBy: UserCreateNestedOneWithoutProposedPromotionsInput
    approvedBy?: UserCreateNestedOneWithoutApprovedPromotionsInput
  }

  export type PromotionRequestUncheckedCreateInput = {
    id?: string
    studentProfileId: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    proposedById: string
    approvedById?: string | null
    status?: $Enums.RequestStatus
    createdAt?: Date | string
  }

  export type PromotionRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneRequiredWithoutPromotionRequestsNestedInput
    proposedBy?: UserUpdateOneRequiredWithoutProposedPromotionsNestedInput
    approvedBy?: UserUpdateOneWithoutApprovedPromotionsNestedInput
  }

  export type PromotionRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    proposedById?: StringFieldUpdateOperationsInput | string
    approvedById?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionRequestCreateManyInput = {
    id?: string
    studentProfileId: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    proposedById: string
    approvedById?: string | null
    status?: $Enums.RequestStatus
    createdAt?: Date | string
  }

  export type PromotionRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    proposedById?: StringFieldUpdateOperationsInput | string
    approvedById?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeePlanCreateInput = {
    id?: string
    name: string
    monthlyPrice: number
    subscriptions?: StudentSubscriptionCreateNestedManyWithoutFeePlanInput
  }

  export type FeePlanUncheckedCreateInput = {
    id?: string
    name: string
    monthlyPrice: number
    subscriptions?: StudentSubscriptionUncheckedCreateNestedManyWithoutFeePlanInput
  }

  export type FeePlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: FloatFieldUpdateOperationsInput | number
    subscriptions?: StudentSubscriptionUpdateManyWithoutFeePlanNestedInput
  }

  export type FeePlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: FloatFieldUpdateOperationsInput | number
    subscriptions?: StudentSubscriptionUncheckedUpdateManyWithoutFeePlanNestedInput
  }

  export type FeePlanCreateManyInput = {
    id?: string
    name: string
    monthlyPrice: number
  }

  export type FeePlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: FloatFieldUpdateOperationsInput | number
  }

  export type FeePlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: FloatFieldUpdateOperationsInput | number
  }

  export type StudentSubscriptionCreateInput = {
    id?: string
    isActive?: boolean
    mandateReference?: string | null
    student: StudentProfileCreateNestedOneWithoutSubscriptionsInput
    feePlan: FeePlanCreateNestedOneWithoutSubscriptionsInput
  }

  export type StudentSubscriptionUncheckedCreateInput = {
    id?: string
    studentProfileId: string
    feePlanId: string
    isActive?: boolean
    mandateReference?: string | null
  }

  export type StudentSubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mandateReference?: NullableStringFieldUpdateOperationsInput | string | null
    student?: StudentProfileUpdateOneRequiredWithoutSubscriptionsNestedInput
    feePlan?: FeePlanUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type StudentSubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    feePlanId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mandateReference?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StudentSubscriptionCreateManyInput = {
    id?: string
    studentProfileId: string
    feePlanId: string
    isActive?: boolean
    mandateReference?: string | null
  }

  export type StudentSubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mandateReference?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StudentSubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    feePlanId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mandateReference?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FederationCreateInput = {
    id?: string
    name: string
    country: string
    licenses?: StudentLicenseCreateNestedManyWithoutFederationInput
  }

  export type FederationUncheckedCreateInput = {
    id?: string
    name: string
    country: string
    licenses?: StudentLicenseUncheckedCreateNestedManyWithoutFederationInput
  }

  export type FederationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    licenses?: StudentLicenseUpdateManyWithoutFederationNestedInput
  }

  export type FederationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    licenses?: StudentLicenseUncheckedUpdateManyWithoutFederationNestedInput
  }

  export type FederationCreateManyInput = {
    id?: string
    name: string
    country: string
  }

  export type FederationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
  }

  export type FederationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
  }

  export type StudentLicenseCreateInput = {
    id?: string
    licenseNumber: string
    validUntil: Date | string
    isActive?: boolean
    student: StudentProfileCreateNestedOneWithoutLicensesInput
    federation: FederationCreateNestedOneWithoutLicensesInput
  }

  export type StudentLicenseUncheckedCreateInput = {
    id?: string
    studentProfileId: string
    federationId: string
    licenseNumber: string
    validUntil: Date | string
    isActive?: boolean
  }

  export type StudentLicenseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    student?: StudentProfileUpdateOneRequiredWithoutLicensesNestedInput
    federation?: FederationUpdateOneRequiredWithoutLicensesNestedInput
  }

  export type StudentLicenseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    federationId?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StudentLicenseCreateManyInput = {
    id?: string
    studentProfileId: string
    federationId: string
    licenseNumber: string
    validUntil: Date | string
    isActive?: boolean
  }

  export type StudentLicenseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StudentLicenseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    federationId?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StudentProfileNullableRelationFilter = {
    is?: StudentProfileWhereInput | null
    isNot?: StudentProfileWhereInput | null
  }

  export type GuardianNullableRelationFilter = {
    is?: GuardianWhereInput | null
    isNot?: GuardianWhereInput | null
  }

  export type ProfileUpdateRequestListRelationFilter = {
    every?: ProfileUpdateRequestWhereInput
    some?: ProfileUpdateRequestWhereInput
    none?: ProfileUpdateRequestWhereInput
  }

  export type PromotionRequestListRelationFilter = {
    every?: PromotionRequestWhereInput
    some?: PromotionRequestWhereInput
    none?: PromotionRequestWhereInput
  }

  export type ProfileUpdateRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PromotionRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type StudentGuardianListRelationFilter = {
    every?: StudentGuardianWhereInput
    some?: StudentGuardianWhereInput
    none?: StudentGuardianWhereInput
  }

  export type StudentRankListRelationFilter = {
    every?: StudentRankWhereInput
    some?: StudentRankWhereInput
    none?: StudentRankWhereInput
  }

  export type AttendanceListRelationFilter = {
    every?: AttendanceWhereInput
    some?: AttendanceWhereInput
    none?: AttendanceWhereInput
  }

  export type StudentSubscriptionListRelationFilter = {
    every?: StudentSubscriptionWhereInput
    some?: StudentSubscriptionWhereInput
    none?: StudentSubscriptionWhereInput
  }

  export type StudentLicenseListRelationFilter = {
    every?: StudentLicenseWhereInput
    some?: StudentLicenseWhereInput
    none?: StudentLicenseWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StudentGuardianOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentRankOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AttendanceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentSubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentLicenseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    birthDate?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    birthDate?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    birthDate?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type GuardianCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type GuardianMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type GuardianMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
  }

  export type StudentProfileRelationFilter = {
    is?: StudentProfileWhereInput
    isNot?: StudentProfileWhereInput
  }

  export type GuardianRelationFilter = {
    is?: GuardianWhereInput
    isNot?: GuardianWhereInput
  }

  export type StudentGuardianStudentProfileIdGuardianIdCompoundUniqueInput = {
    studentProfileId: string
    guardianId: string
  }

  export type StudentGuardianCountOrderByAggregateInput = {
    studentProfileId?: SortOrder
    guardianId?: SortOrder
    relationship?: SortOrder
  }

  export type StudentGuardianMaxOrderByAggregateInput = {
    studentProfileId?: SortOrder
    guardianId?: SortOrder
    relationship?: SortOrder
  }

  export type StudentGuardianMinOrderByAggregateInput = {
    studentProfileId?: SortOrder
    guardianId?: SortOrder
    relationship?: SortOrder
  }

  export type DisciplineProgramListRelationFilter = {
    every?: DisciplineProgramWhereInput
    some?: DisciplineProgramWhereInput
    none?: DisciplineProgramWhereInput
  }

  export type DisciplineProgramOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DisciplineCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type DisciplineMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type DisciplineMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DisciplineRelationFilter = {
    is?: DisciplineWhereInput
    isNot?: DisciplineWhereInput
  }

  export type BeltRankListRelationFilter = {
    every?: BeltRankWhereInput
    some?: BeltRankWhereInput
    none?: BeltRankWhereInput
  }

  export type BeltRankOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DisciplineProgramCountOrderByAggregateInput = {
    id?: SortOrder
    disciplineId?: SortOrder
    name?: SortOrder
    minAge?: SortOrder
    maxAge?: SortOrder
  }

  export type DisciplineProgramAvgOrderByAggregateInput = {
    minAge?: SortOrder
    maxAge?: SortOrder
  }

  export type DisciplineProgramMaxOrderByAggregateInput = {
    id?: SortOrder
    disciplineId?: SortOrder
    name?: SortOrder
    minAge?: SortOrder
    maxAge?: SortOrder
  }

  export type DisciplineProgramMinOrderByAggregateInput = {
    id?: SortOrder
    disciplineId?: SortOrder
    name?: SortOrder
    minAge?: SortOrder
    maxAge?: SortOrder
  }

  export type DisciplineProgramSumOrderByAggregateInput = {
    minAge?: SortOrder
    maxAge?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DisciplineProgramRelationFilter = {
    is?: DisciplineProgramWhereInput
    isNot?: DisciplineProgramWhereInput
  }

  export type BeltRankCountOrderByAggregateInput = {
    id?: SortOrder
    disciplineProgramId?: SortOrder
    name?: SortOrder
    order?: SortOrder
    maxStripes?: SortOrder
    minMonthsRequired?: SortOrder
    minHoursRequired?: SortOrder
  }

  export type BeltRankAvgOrderByAggregateInput = {
    order?: SortOrder
    maxStripes?: SortOrder
    minMonthsRequired?: SortOrder
    minHoursRequired?: SortOrder
  }

  export type BeltRankMaxOrderByAggregateInput = {
    id?: SortOrder
    disciplineProgramId?: SortOrder
    name?: SortOrder
    order?: SortOrder
    maxStripes?: SortOrder
    minMonthsRequired?: SortOrder
    minHoursRequired?: SortOrder
  }

  export type BeltRankMinOrderByAggregateInput = {
    id?: SortOrder
    disciplineProgramId?: SortOrder
    name?: SortOrder
    order?: SortOrder
    maxStripes?: SortOrder
    minMonthsRequired?: SortOrder
    minHoursRequired?: SortOrder
  }

  export type BeltRankSumOrderByAggregateInput = {
    order?: SortOrder
    maxStripes?: SortOrder
    minMonthsRequired?: SortOrder
    minHoursRequired?: SortOrder
  }

  export type BeltRankRelationFilter = {
    is?: BeltRankWhereInput
    isNot?: BeltRankWhereInput
  }

  export type StudentRankCountOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    beltRankId?: SortOrder
    currentStripes?: SortOrder
    accumulatedHours?: SortOrder
    promotedAt?: SortOrder
    lastStripeAt?: SortOrder
  }

  export type StudentRankAvgOrderByAggregateInput = {
    currentStripes?: SortOrder
    accumulatedHours?: SortOrder
  }

  export type StudentRankMaxOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    beltRankId?: SortOrder
    currentStripes?: SortOrder
    accumulatedHours?: SortOrder
    promotedAt?: SortOrder
    lastStripeAt?: SortOrder
  }

  export type StudentRankMinOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    beltRankId?: SortOrder
    currentStripes?: SortOrder
    accumulatedHours?: SortOrder
    promotedAt?: SortOrder
    lastStripeAt?: SortOrder
  }

  export type StudentRankSumOrderByAggregateInput = {
    currentStripes?: SortOrder
    accumulatedHours?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AttendanceCountOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    date?: SortOrder
    countedForRank?: SortOrder
  }

  export type AttendanceMaxOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    date?: SortOrder
    countedForRank?: SortOrder
  }

  export type AttendanceMinOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    date?: SortOrder
    countedForRank?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ProfileUpdateRequestCountOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    requestedChanges?: SortOrder
    status?: SortOrder
    reviewedById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileUpdateRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    status?: SortOrder
    reviewedById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileUpdateRequestMinOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    status?: SortOrder
    reviewedById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumRequestStatusFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type PromotionRequestCountOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    proposedBeltId?: SortOrder
    proposedStripes?: SortOrder
    proposedById?: SortOrder
    approvedById?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PromotionRequestAvgOrderByAggregateInput = {
    proposedStripes?: SortOrder
  }

  export type PromotionRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    proposedBeltId?: SortOrder
    proposedStripes?: SortOrder
    proposedById?: SortOrder
    approvedById?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PromotionRequestMinOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    proposedBeltId?: SortOrder
    proposedStripes?: SortOrder
    proposedById?: SortOrder
    approvedById?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PromotionRequestSumOrderByAggregateInput = {
    proposedStripes?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type FeePlanCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    monthlyPrice?: SortOrder
  }

  export type FeePlanAvgOrderByAggregateInput = {
    monthlyPrice?: SortOrder
  }

  export type FeePlanMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    monthlyPrice?: SortOrder
  }

  export type FeePlanMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    monthlyPrice?: SortOrder
  }

  export type FeePlanSumOrderByAggregateInput = {
    monthlyPrice?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FeePlanRelationFilter = {
    is?: FeePlanWhereInput
    isNot?: FeePlanWhereInput
  }

  export type StudentSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    feePlanId?: SortOrder
    isActive?: SortOrder
    mandateReference?: SortOrder
  }

  export type StudentSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    feePlanId?: SortOrder
    isActive?: SortOrder
    mandateReference?: SortOrder
  }

  export type StudentSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    feePlanId?: SortOrder
    isActive?: SortOrder
    mandateReference?: SortOrder
  }

  export type FederationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    country?: SortOrder
  }

  export type FederationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    country?: SortOrder
  }

  export type FederationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    country?: SortOrder
  }

  export type FederationRelationFilter = {
    is?: FederationWhereInput
    isNot?: FederationWhereInput
  }

  export type StudentLicenseCountOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    federationId?: SortOrder
    licenseNumber?: SortOrder
    validUntil?: SortOrder
    isActive?: SortOrder
  }

  export type StudentLicenseMaxOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    federationId?: SortOrder
    licenseNumber?: SortOrder
    validUntil?: SortOrder
    isActive?: SortOrder
  }

  export type StudentLicenseMinOrderByAggregateInput = {
    id?: SortOrder
    studentProfileId?: SortOrder
    federationId?: SortOrder
    licenseNumber?: SortOrder
    validUntil?: SortOrder
    isActive?: SortOrder
  }

  export type StudentProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutUserInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type GuardianCreateNestedOneWithoutUserInput = {
    create?: XOR<GuardianCreateWithoutUserInput, GuardianUncheckedCreateWithoutUserInput>
    connectOrCreate?: GuardianCreateOrConnectWithoutUserInput
    connect?: GuardianWhereUniqueInput
  }

  export type ProfileUpdateRequestCreateNestedManyWithoutReviewerInput = {
    create?: XOR<ProfileUpdateRequestCreateWithoutReviewerInput, ProfileUpdateRequestUncheckedCreateWithoutReviewerInput> | ProfileUpdateRequestCreateWithoutReviewerInput[] | ProfileUpdateRequestUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ProfileUpdateRequestCreateOrConnectWithoutReviewerInput | ProfileUpdateRequestCreateOrConnectWithoutReviewerInput[]
    createMany?: ProfileUpdateRequestCreateManyReviewerInputEnvelope
    connect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
  }

  export type PromotionRequestCreateNestedManyWithoutProposedByInput = {
    create?: XOR<PromotionRequestCreateWithoutProposedByInput, PromotionRequestUncheckedCreateWithoutProposedByInput> | PromotionRequestCreateWithoutProposedByInput[] | PromotionRequestUncheckedCreateWithoutProposedByInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutProposedByInput | PromotionRequestCreateOrConnectWithoutProposedByInput[]
    createMany?: PromotionRequestCreateManyProposedByInputEnvelope
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
  }

  export type PromotionRequestCreateNestedManyWithoutApprovedByInput = {
    create?: XOR<PromotionRequestCreateWithoutApprovedByInput, PromotionRequestUncheckedCreateWithoutApprovedByInput> | PromotionRequestCreateWithoutApprovedByInput[] | PromotionRequestUncheckedCreateWithoutApprovedByInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutApprovedByInput | PromotionRequestCreateOrConnectWithoutApprovedByInput[]
    createMany?: PromotionRequestCreateManyApprovedByInputEnvelope
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
  }

  export type StudentProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutUserInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type GuardianUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<GuardianCreateWithoutUserInput, GuardianUncheckedCreateWithoutUserInput>
    connectOrCreate?: GuardianCreateOrConnectWithoutUserInput
    connect?: GuardianWhereUniqueInput
  }

  export type ProfileUpdateRequestUncheckedCreateNestedManyWithoutReviewerInput = {
    create?: XOR<ProfileUpdateRequestCreateWithoutReviewerInput, ProfileUpdateRequestUncheckedCreateWithoutReviewerInput> | ProfileUpdateRequestCreateWithoutReviewerInput[] | ProfileUpdateRequestUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ProfileUpdateRequestCreateOrConnectWithoutReviewerInput | ProfileUpdateRequestCreateOrConnectWithoutReviewerInput[]
    createMany?: ProfileUpdateRequestCreateManyReviewerInputEnvelope
    connect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
  }

  export type PromotionRequestUncheckedCreateNestedManyWithoutProposedByInput = {
    create?: XOR<PromotionRequestCreateWithoutProposedByInput, PromotionRequestUncheckedCreateWithoutProposedByInput> | PromotionRequestCreateWithoutProposedByInput[] | PromotionRequestUncheckedCreateWithoutProposedByInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutProposedByInput | PromotionRequestCreateOrConnectWithoutProposedByInput[]
    createMany?: PromotionRequestCreateManyProposedByInputEnvelope
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
  }

  export type PromotionRequestUncheckedCreateNestedManyWithoutApprovedByInput = {
    create?: XOR<PromotionRequestCreateWithoutApprovedByInput, PromotionRequestUncheckedCreateWithoutApprovedByInput> | PromotionRequestCreateWithoutApprovedByInput[] | PromotionRequestUncheckedCreateWithoutApprovedByInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutApprovedByInput | PromotionRequestCreateOrConnectWithoutApprovedByInput[]
    createMany?: PromotionRequestCreateManyApprovedByInputEnvelope
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StudentProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutUserInput
    upsert?: StudentProfileUpsertWithoutUserInput
    disconnect?: StudentProfileWhereInput | boolean
    delete?: StudentProfileWhereInput | boolean
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutUserInput, StudentProfileUpdateWithoutUserInput>, StudentProfileUncheckedUpdateWithoutUserInput>
  }

  export type GuardianUpdateOneWithoutUserNestedInput = {
    create?: XOR<GuardianCreateWithoutUserInput, GuardianUncheckedCreateWithoutUserInput>
    connectOrCreate?: GuardianCreateOrConnectWithoutUserInput
    upsert?: GuardianUpsertWithoutUserInput
    disconnect?: GuardianWhereInput | boolean
    delete?: GuardianWhereInput | boolean
    connect?: GuardianWhereUniqueInput
    update?: XOR<XOR<GuardianUpdateToOneWithWhereWithoutUserInput, GuardianUpdateWithoutUserInput>, GuardianUncheckedUpdateWithoutUserInput>
  }

  export type ProfileUpdateRequestUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<ProfileUpdateRequestCreateWithoutReviewerInput, ProfileUpdateRequestUncheckedCreateWithoutReviewerInput> | ProfileUpdateRequestCreateWithoutReviewerInput[] | ProfileUpdateRequestUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ProfileUpdateRequestCreateOrConnectWithoutReviewerInput | ProfileUpdateRequestCreateOrConnectWithoutReviewerInput[]
    upsert?: ProfileUpdateRequestUpsertWithWhereUniqueWithoutReviewerInput | ProfileUpdateRequestUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: ProfileUpdateRequestCreateManyReviewerInputEnvelope
    set?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    disconnect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    delete?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    connect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    update?: ProfileUpdateRequestUpdateWithWhereUniqueWithoutReviewerInput | ProfileUpdateRequestUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: ProfileUpdateRequestUpdateManyWithWhereWithoutReviewerInput | ProfileUpdateRequestUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: ProfileUpdateRequestScalarWhereInput | ProfileUpdateRequestScalarWhereInput[]
  }

  export type PromotionRequestUpdateManyWithoutProposedByNestedInput = {
    create?: XOR<PromotionRequestCreateWithoutProposedByInput, PromotionRequestUncheckedCreateWithoutProposedByInput> | PromotionRequestCreateWithoutProposedByInput[] | PromotionRequestUncheckedCreateWithoutProposedByInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutProposedByInput | PromotionRequestCreateOrConnectWithoutProposedByInput[]
    upsert?: PromotionRequestUpsertWithWhereUniqueWithoutProposedByInput | PromotionRequestUpsertWithWhereUniqueWithoutProposedByInput[]
    createMany?: PromotionRequestCreateManyProposedByInputEnvelope
    set?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    disconnect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    delete?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    update?: PromotionRequestUpdateWithWhereUniqueWithoutProposedByInput | PromotionRequestUpdateWithWhereUniqueWithoutProposedByInput[]
    updateMany?: PromotionRequestUpdateManyWithWhereWithoutProposedByInput | PromotionRequestUpdateManyWithWhereWithoutProposedByInput[]
    deleteMany?: PromotionRequestScalarWhereInput | PromotionRequestScalarWhereInput[]
  }

  export type PromotionRequestUpdateManyWithoutApprovedByNestedInput = {
    create?: XOR<PromotionRequestCreateWithoutApprovedByInput, PromotionRequestUncheckedCreateWithoutApprovedByInput> | PromotionRequestCreateWithoutApprovedByInput[] | PromotionRequestUncheckedCreateWithoutApprovedByInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutApprovedByInput | PromotionRequestCreateOrConnectWithoutApprovedByInput[]
    upsert?: PromotionRequestUpsertWithWhereUniqueWithoutApprovedByInput | PromotionRequestUpsertWithWhereUniqueWithoutApprovedByInput[]
    createMany?: PromotionRequestCreateManyApprovedByInputEnvelope
    set?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    disconnect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    delete?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    update?: PromotionRequestUpdateWithWhereUniqueWithoutApprovedByInput | PromotionRequestUpdateWithWhereUniqueWithoutApprovedByInput[]
    updateMany?: PromotionRequestUpdateManyWithWhereWithoutApprovedByInput | PromotionRequestUpdateManyWithWhereWithoutApprovedByInput[]
    deleteMany?: PromotionRequestScalarWhereInput | PromotionRequestScalarWhereInput[]
  }

  export type StudentProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutUserInput
    upsert?: StudentProfileUpsertWithoutUserInput
    disconnect?: StudentProfileWhereInput | boolean
    delete?: StudentProfileWhereInput | boolean
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutUserInput, StudentProfileUpdateWithoutUserInput>, StudentProfileUncheckedUpdateWithoutUserInput>
  }

  export type GuardianUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<GuardianCreateWithoutUserInput, GuardianUncheckedCreateWithoutUserInput>
    connectOrCreate?: GuardianCreateOrConnectWithoutUserInput
    upsert?: GuardianUpsertWithoutUserInput
    disconnect?: GuardianWhereInput | boolean
    delete?: GuardianWhereInput | boolean
    connect?: GuardianWhereUniqueInput
    update?: XOR<XOR<GuardianUpdateToOneWithWhereWithoutUserInput, GuardianUpdateWithoutUserInput>, GuardianUncheckedUpdateWithoutUserInput>
  }

  export type ProfileUpdateRequestUncheckedUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<ProfileUpdateRequestCreateWithoutReviewerInput, ProfileUpdateRequestUncheckedCreateWithoutReviewerInput> | ProfileUpdateRequestCreateWithoutReviewerInput[] | ProfileUpdateRequestUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: ProfileUpdateRequestCreateOrConnectWithoutReviewerInput | ProfileUpdateRequestCreateOrConnectWithoutReviewerInput[]
    upsert?: ProfileUpdateRequestUpsertWithWhereUniqueWithoutReviewerInput | ProfileUpdateRequestUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: ProfileUpdateRequestCreateManyReviewerInputEnvelope
    set?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    disconnect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    delete?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    connect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    update?: ProfileUpdateRequestUpdateWithWhereUniqueWithoutReviewerInput | ProfileUpdateRequestUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: ProfileUpdateRequestUpdateManyWithWhereWithoutReviewerInput | ProfileUpdateRequestUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: ProfileUpdateRequestScalarWhereInput | ProfileUpdateRequestScalarWhereInput[]
  }

  export type PromotionRequestUncheckedUpdateManyWithoutProposedByNestedInput = {
    create?: XOR<PromotionRequestCreateWithoutProposedByInput, PromotionRequestUncheckedCreateWithoutProposedByInput> | PromotionRequestCreateWithoutProposedByInput[] | PromotionRequestUncheckedCreateWithoutProposedByInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutProposedByInput | PromotionRequestCreateOrConnectWithoutProposedByInput[]
    upsert?: PromotionRequestUpsertWithWhereUniqueWithoutProposedByInput | PromotionRequestUpsertWithWhereUniqueWithoutProposedByInput[]
    createMany?: PromotionRequestCreateManyProposedByInputEnvelope
    set?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    disconnect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    delete?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    update?: PromotionRequestUpdateWithWhereUniqueWithoutProposedByInput | PromotionRequestUpdateWithWhereUniqueWithoutProposedByInput[]
    updateMany?: PromotionRequestUpdateManyWithWhereWithoutProposedByInput | PromotionRequestUpdateManyWithWhereWithoutProposedByInput[]
    deleteMany?: PromotionRequestScalarWhereInput | PromotionRequestScalarWhereInput[]
  }

  export type PromotionRequestUncheckedUpdateManyWithoutApprovedByNestedInput = {
    create?: XOR<PromotionRequestCreateWithoutApprovedByInput, PromotionRequestUncheckedCreateWithoutApprovedByInput> | PromotionRequestCreateWithoutApprovedByInput[] | PromotionRequestUncheckedCreateWithoutApprovedByInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutApprovedByInput | PromotionRequestCreateOrConnectWithoutApprovedByInput[]
    upsert?: PromotionRequestUpsertWithWhereUniqueWithoutApprovedByInput | PromotionRequestUpsertWithWhereUniqueWithoutApprovedByInput[]
    createMany?: PromotionRequestCreateManyApprovedByInputEnvelope
    set?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    disconnect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    delete?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    update?: PromotionRequestUpdateWithWhereUniqueWithoutApprovedByInput | PromotionRequestUpdateWithWhereUniqueWithoutApprovedByInput[]
    updateMany?: PromotionRequestUpdateManyWithWhereWithoutApprovedByInput | PromotionRequestUpdateManyWithWhereWithoutApprovedByInput[]
    deleteMany?: PromotionRequestScalarWhereInput | PromotionRequestScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutStudentProfileInput = {
    create?: XOR<UserCreateWithoutStudentProfileInput, UserUncheckedCreateWithoutStudentProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentProfileInput
    connect?: UserWhereUniqueInput
  }

  export type StudentGuardianCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentGuardianCreateWithoutStudentInput, StudentGuardianUncheckedCreateWithoutStudentInput> | StudentGuardianCreateWithoutStudentInput[] | StudentGuardianUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentGuardianCreateOrConnectWithoutStudentInput | StudentGuardianCreateOrConnectWithoutStudentInput[]
    createMany?: StudentGuardianCreateManyStudentInputEnvelope
    connect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
  }

  export type StudentRankCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentRankCreateWithoutStudentInput, StudentRankUncheckedCreateWithoutStudentInput> | StudentRankCreateWithoutStudentInput[] | StudentRankUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentRankCreateOrConnectWithoutStudentInput | StudentRankCreateOrConnectWithoutStudentInput[]
    createMany?: StudentRankCreateManyStudentInputEnvelope
    connect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
  }

  export type AttendanceCreateNestedManyWithoutStudentInput = {
    create?: XOR<AttendanceCreateWithoutStudentInput, AttendanceUncheckedCreateWithoutStudentInput> | AttendanceCreateWithoutStudentInput[] | AttendanceUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: AttendanceCreateOrConnectWithoutStudentInput | AttendanceCreateOrConnectWithoutStudentInput[]
    createMany?: AttendanceCreateManyStudentInputEnvelope
    connect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
  }

  export type ProfileUpdateRequestCreateNestedManyWithoutStudentProfileInput = {
    create?: XOR<ProfileUpdateRequestCreateWithoutStudentProfileInput, ProfileUpdateRequestUncheckedCreateWithoutStudentProfileInput> | ProfileUpdateRequestCreateWithoutStudentProfileInput[] | ProfileUpdateRequestUncheckedCreateWithoutStudentProfileInput[]
    connectOrCreate?: ProfileUpdateRequestCreateOrConnectWithoutStudentProfileInput | ProfileUpdateRequestCreateOrConnectWithoutStudentProfileInput[]
    createMany?: ProfileUpdateRequestCreateManyStudentProfileInputEnvelope
    connect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
  }

  export type PromotionRequestCreateNestedManyWithoutStudentProfileInput = {
    create?: XOR<PromotionRequestCreateWithoutStudentProfileInput, PromotionRequestUncheckedCreateWithoutStudentProfileInput> | PromotionRequestCreateWithoutStudentProfileInput[] | PromotionRequestUncheckedCreateWithoutStudentProfileInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutStudentProfileInput | PromotionRequestCreateOrConnectWithoutStudentProfileInput[]
    createMany?: PromotionRequestCreateManyStudentProfileInputEnvelope
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
  }

  export type StudentSubscriptionCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentSubscriptionCreateWithoutStudentInput, StudentSubscriptionUncheckedCreateWithoutStudentInput> | StudentSubscriptionCreateWithoutStudentInput[] | StudentSubscriptionUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentSubscriptionCreateOrConnectWithoutStudentInput | StudentSubscriptionCreateOrConnectWithoutStudentInput[]
    createMany?: StudentSubscriptionCreateManyStudentInputEnvelope
    connect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
  }

  export type StudentLicenseCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentLicenseCreateWithoutStudentInput, StudentLicenseUncheckedCreateWithoutStudentInput> | StudentLicenseCreateWithoutStudentInput[] | StudentLicenseUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentLicenseCreateOrConnectWithoutStudentInput | StudentLicenseCreateOrConnectWithoutStudentInput[]
    createMany?: StudentLicenseCreateManyStudentInputEnvelope
    connect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
  }

  export type StudentGuardianUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentGuardianCreateWithoutStudentInput, StudentGuardianUncheckedCreateWithoutStudentInput> | StudentGuardianCreateWithoutStudentInput[] | StudentGuardianUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentGuardianCreateOrConnectWithoutStudentInput | StudentGuardianCreateOrConnectWithoutStudentInput[]
    createMany?: StudentGuardianCreateManyStudentInputEnvelope
    connect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
  }

  export type StudentRankUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentRankCreateWithoutStudentInput, StudentRankUncheckedCreateWithoutStudentInput> | StudentRankCreateWithoutStudentInput[] | StudentRankUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentRankCreateOrConnectWithoutStudentInput | StudentRankCreateOrConnectWithoutStudentInput[]
    createMany?: StudentRankCreateManyStudentInputEnvelope
    connect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
  }

  export type AttendanceUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<AttendanceCreateWithoutStudentInput, AttendanceUncheckedCreateWithoutStudentInput> | AttendanceCreateWithoutStudentInput[] | AttendanceUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: AttendanceCreateOrConnectWithoutStudentInput | AttendanceCreateOrConnectWithoutStudentInput[]
    createMany?: AttendanceCreateManyStudentInputEnvelope
    connect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
  }

  export type ProfileUpdateRequestUncheckedCreateNestedManyWithoutStudentProfileInput = {
    create?: XOR<ProfileUpdateRequestCreateWithoutStudentProfileInput, ProfileUpdateRequestUncheckedCreateWithoutStudentProfileInput> | ProfileUpdateRequestCreateWithoutStudentProfileInput[] | ProfileUpdateRequestUncheckedCreateWithoutStudentProfileInput[]
    connectOrCreate?: ProfileUpdateRequestCreateOrConnectWithoutStudentProfileInput | ProfileUpdateRequestCreateOrConnectWithoutStudentProfileInput[]
    createMany?: ProfileUpdateRequestCreateManyStudentProfileInputEnvelope
    connect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
  }

  export type PromotionRequestUncheckedCreateNestedManyWithoutStudentProfileInput = {
    create?: XOR<PromotionRequestCreateWithoutStudentProfileInput, PromotionRequestUncheckedCreateWithoutStudentProfileInput> | PromotionRequestCreateWithoutStudentProfileInput[] | PromotionRequestUncheckedCreateWithoutStudentProfileInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutStudentProfileInput | PromotionRequestCreateOrConnectWithoutStudentProfileInput[]
    createMany?: PromotionRequestCreateManyStudentProfileInputEnvelope
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
  }

  export type StudentSubscriptionUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentSubscriptionCreateWithoutStudentInput, StudentSubscriptionUncheckedCreateWithoutStudentInput> | StudentSubscriptionCreateWithoutStudentInput[] | StudentSubscriptionUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentSubscriptionCreateOrConnectWithoutStudentInput | StudentSubscriptionCreateOrConnectWithoutStudentInput[]
    createMany?: StudentSubscriptionCreateManyStudentInputEnvelope
    connect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
  }

  export type StudentLicenseUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<StudentLicenseCreateWithoutStudentInput, StudentLicenseUncheckedCreateWithoutStudentInput> | StudentLicenseCreateWithoutStudentInput[] | StudentLicenseUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentLicenseCreateOrConnectWithoutStudentInput | StudentLicenseCreateOrConnectWithoutStudentInput[]
    createMany?: StudentLicenseCreateManyStudentInputEnvelope
    connect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneRequiredWithoutStudentProfileNestedInput = {
    create?: XOR<UserCreateWithoutStudentProfileInput, UserUncheckedCreateWithoutStudentProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentProfileInput
    upsert?: UserUpsertWithoutStudentProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStudentProfileInput, UserUpdateWithoutStudentProfileInput>, UserUncheckedUpdateWithoutStudentProfileInput>
  }

  export type StudentGuardianUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentGuardianCreateWithoutStudentInput, StudentGuardianUncheckedCreateWithoutStudentInput> | StudentGuardianCreateWithoutStudentInput[] | StudentGuardianUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentGuardianCreateOrConnectWithoutStudentInput | StudentGuardianCreateOrConnectWithoutStudentInput[]
    upsert?: StudentGuardianUpsertWithWhereUniqueWithoutStudentInput | StudentGuardianUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentGuardianCreateManyStudentInputEnvelope
    set?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    disconnect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    delete?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    connect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    update?: StudentGuardianUpdateWithWhereUniqueWithoutStudentInput | StudentGuardianUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentGuardianUpdateManyWithWhereWithoutStudentInput | StudentGuardianUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentGuardianScalarWhereInput | StudentGuardianScalarWhereInput[]
  }

  export type StudentRankUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentRankCreateWithoutStudentInput, StudentRankUncheckedCreateWithoutStudentInput> | StudentRankCreateWithoutStudentInput[] | StudentRankUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentRankCreateOrConnectWithoutStudentInput | StudentRankCreateOrConnectWithoutStudentInput[]
    upsert?: StudentRankUpsertWithWhereUniqueWithoutStudentInput | StudentRankUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentRankCreateManyStudentInputEnvelope
    set?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    disconnect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    delete?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    connect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    update?: StudentRankUpdateWithWhereUniqueWithoutStudentInput | StudentRankUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentRankUpdateManyWithWhereWithoutStudentInput | StudentRankUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentRankScalarWhereInput | StudentRankScalarWhereInput[]
  }

  export type AttendanceUpdateManyWithoutStudentNestedInput = {
    create?: XOR<AttendanceCreateWithoutStudentInput, AttendanceUncheckedCreateWithoutStudentInput> | AttendanceCreateWithoutStudentInput[] | AttendanceUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: AttendanceCreateOrConnectWithoutStudentInput | AttendanceCreateOrConnectWithoutStudentInput[]
    upsert?: AttendanceUpsertWithWhereUniqueWithoutStudentInput | AttendanceUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: AttendanceCreateManyStudentInputEnvelope
    set?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    disconnect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    delete?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    connect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    update?: AttendanceUpdateWithWhereUniqueWithoutStudentInput | AttendanceUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: AttendanceUpdateManyWithWhereWithoutStudentInput | AttendanceUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: AttendanceScalarWhereInput | AttendanceScalarWhereInput[]
  }

  export type ProfileUpdateRequestUpdateManyWithoutStudentProfileNestedInput = {
    create?: XOR<ProfileUpdateRequestCreateWithoutStudentProfileInput, ProfileUpdateRequestUncheckedCreateWithoutStudentProfileInput> | ProfileUpdateRequestCreateWithoutStudentProfileInput[] | ProfileUpdateRequestUncheckedCreateWithoutStudentProfileInput[]
    connectOrCreate?: ProfileUpdateRequestCreateOrConnectWithoutStudentProfileInput | ProfileUpdateRequestCreateOrConnectWithoutStudentProfileInput[]
    upsert?: ProfileUpdateRequestUpsertWithWhereUniqueWithoutStudentProfileInput | ProfileUpdateRequestUpsertWithWhereUniqueWithoutStudentProfileInput[]
    createMany?: ProfileUpdateRequestCreateManyStudentProfileInputEnvelope
    set?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    disconnect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    delete?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    connect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    update?: ProfileUpdateRequestUpdateWithWhereUniqueWithoutStudentProfileInput | ProfileUpdateRequestUpdateWithWhereUniqueWithoutStudentProfileInput[]
    updateMany?: ProfileUpdateRequestUpdateManyWithWhereWithoutStudentProfileInput | ProfileUpdateRequestUpdateManyWithWhereWithoutStudentProfileInput[]
    deleteMany?: ProfileUpdateRequestScalarWhereInput | ProfileUpdateRequestScalarWhereInput[]
  }

  export type PromotionRequestUpdateManyWithoutStudentProfileNestedInput = {
    create?: XOR<PromotionRequestCreateWithoutStudentProfileInput, PromotionRequestUncheckedCreateWithoutStudentProfileInput> | PromotionRequestCreateWithoutStudentProfileInput[] | PromotionRequestUncheckedCreateWithoutStudentProfileInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutStudentProfileInput | PromotionRequestCreateOrConnectWithoutStudentProfileInput[]
    upsert?: PromotionRequestUpsertWithWhereUniqueWithoutStudentProfileInput | PromotionRequestUpsertWithWhereUniqueWithoutStudentProfileInput[]
    createMany?: PromotionRequestCreateManyStudentProfileInputEnvelope
    set?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    disconnect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    delete?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    update?: PromotionRequestUpdateWithWhereUniqueWithoutStudentProfileInput | PromotionRequestUpdateWithWhereUniqueWithoutStudentProfileInput[]
    updateMany?: PromotionRequestUpdateManyWithWhereWithoutStudentProfileInput | PromotionRequestUpdateManyWithWhereWithoutStudentProfileInput[]
    deleteMany?: PromotionRequestScalarWhereInput | PromotionRequestScalarWhereInput[]
  }

  export type StudentSubscriptionUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentSubscriptionCreateWithoutStudentInput, StudentSubscriptionUncheckedCreateWithoutStudentInput> | StudentSubscriptionCreateWithoutStudentInput[] | StudentSubscriptionUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentSubscriptionCreateOrConnectWithoutStudentInput | StudentSubscriptionCreateOrConnectWithoutStudentInput[]
    upsert?: StudentSubscriptionUpsertWithWhereUniqueWithoutStudentInput | StudentSubscriptionUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentSubscriptionCreateManyStudentInputEnvelope
    set?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    disconnect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    delete?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    connect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    update?: StudentSubscriptionUpdateWithWhereUniqueWithoutStudentInput | StudentSubscriptionUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentSubscriptionUpdateManyWithWhereWithoutStudentInput | StudentSubscriptionUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentSubscriptionScalarWhereInput | StudentSubscriptionScalarWhereInput[]
  }

  export type StudentLicenseUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentLicenseCreateWithoutStudentInput, StudentLicenseUncheckedCreateWithoutStudentInput> | StudentLicenseCreateWithoutStudentInput[] | StudentLicenseUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentLicenseCreateOrConnectWithoutStudentInput | StudentLicenseCreateOrConnectWithoutStudentInput[]
    upsert?: StudentLicenseUpsertWithWhereUniqueWithoutStudentInput | StudentLicenseUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentLicenseCreateManyStudentInputEnvelope
    set?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    disconnect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    delete?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    connect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    update?: StudentLicenseUpdateWithWhereUniqueWithoutStudentInput | StudentLicenseUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentLicenseUpdateManyWithWhereWithoutStudentInput | StudentLicenseUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentLicenseScalarWhereInput | StudentLicenseScalarWhereInput[]
  }

  export type StudentGuardianUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentGuardianCreateWithoutStudentInput, StudentGuardianUncheckedCreateWithoutStudentInput> | StudentGuardianCreateWithoutStudentInput[] | StudentGuardianUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentGuardianCreateOrConnectWithoutStudentInput | StudentGuardianCreateOrConnectWithoutStudentInput[]
    upsert?: StudentGuardianUpsertWithWhereUniqueWithoutStudentInput | StudentGuardianUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentGuardianCreateManyStudentInputEnvelope
    set?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    disconnect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    delete?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    connect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    update?: StudentGuardianUpdateWithWhereUniqueWithoutStudentInput | StudentGuardianUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentGuardianUpdateManyWithWhereWithoutStudentInput | StudentGuardianUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentGuardianScalarWhereInput | StudentGuardianScalarWhereInput[]
  }

  export type StudentRankUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentRankCreateWithoutStudentInput, StudentRankUncheckedCreateWithoutStudentInput> | StudentRankCreateWithoutStudentInput[] | StudentRankUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentRankCreateOrConnectWithoutStudentInput | StudentRankCreateOrConnectWithoutStudentInput[]
    upsert?: StudentRankUpsertWithWhereUniqueWithoutStudentInput | StudentRankUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentRankCreateManyStudentInputEnvelope
    set?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    disconnect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    delete?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    connect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    update?: StudentRankUpdateWithWhereUniqueWithoutStudentInput | StudentRankUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentRankUpdateManyWithWhereWithoutStudentInput | StudentRankUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentRankScalarWhereInput | StudentRankScalarWhereInput[]
  }

  export type AttendanceUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<AttendanceCreateWithoutStudentInput, AttendanceUncheckedCreateWithoutStudentInput> | AttendanceCreateWithoutStudentInput[] | AttendanceUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: AttendanceCreateOrConnectWithoutStudentInput | AttendanceCreateOrConnectWithoutStudentInput[]
    upsert?: AttendanceUpsertWithWhereUniqueWithoutStudentInput | AttendanceUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: AttendanceCreateManyStudentInputEnvelope
    set?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    disconnect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    delete?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    connect?: AttendanceWhereUniqueInput | AttendanceWhereUniqueInput[]
    update?: AttendanceUpdateWithWhereUniqueWithoutStudentInput | AttendanceUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: AttendanceUpdateManyWithWhereWithoutStudentInput | AttendanceUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: AttendanceScalarWhereInput | AttendanceScalarWhereInput[]
  }

  export type ProfileUpdateRequestUncheckedUpdateManyWithoutStudentProfileNestedInput = {
    create?: XOR<ProfileUpdateRequestCreateWithoutStudentProfileInput, ProfileUpdateRequestUncheckedCreateWithoutStudentProfileInput> | ProfileUpdateRequestCreateWithoutStudentProfileInput[] | ProfileUpdateRequestUncheckedCreateWithoutStudentProfileInput[]
    connectOrCreate?: ProfileUpdateRequestCreateOrConnectWithoutStudentProfileInput | ProfileUpdateRequestCreateOrConnectWithoutStudentProfileInput[]
    upsert?: ProfileUpdateRequestUpsertWithWhereUniqueWithoutStudentProfileInput | ProfileUpdateRequestUpsertWithWhereUniqueWithoutStudentProfileInput[]
    createMany?: ProfileUpdateRequestCreateManyStudentProfileInputEnvelope
    set?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    disconnect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    delete?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    connect?: ProfileUpdateRequestWhereUniqueInput | ProfileUpdateRequestWhereUniqueInput[]
    update?: ProfileUpdateRequestUpdateWithWhereUniqueWithoutStudentProfileInput | ProfileUpdateRequestUpdateWithWhereUniqueWithoutStudentProfileInput[]
    updateMany?: ProfileUpdateRequestUpdateManyWithWhereWithoutStudentProfileInput | ProfileUpdateRequestUpdateManyWithWhereWithoutStudentProfileInput[]
    deleteMany?: ProfileUpdateRequestScalarWhereInput | ProfileUpdateRequestScalarWhereInput[]
  }

  export type PromotionRequestUncheckedUpdateManyWithoutStudentProfileNestedInput = {
    create?: XOR<PromotionRequestCreateWithoutStudentProfileInput, PromotionRequestUncheckedCreateWithoutStudentProfileInput> | PromotionRequestCreateWithoutStudentProfileInput[] | PromotionRequestUncheckedCreateWithoutStudentProfileInput[]
    connectOrCreate?: PromotionRequestCreateOrConnectWithoutStudentProfileInput | PromotionRequestCreateOrConnectWithoutStudentProfileInput[]
    upsert?: PromotionRequestUpsertWithWhereUniqueWithoutStudentProfileInput | PromotionRequestUpsertWithWhereUniqueWithoutStudentProfileInput[]
    createMany?: PromotionRequestCreateManyStudentProfileInputEnvelope
    set?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    disconnect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    delete?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    connect?: PromotionRequestWhereUniqueInput | PromotionRequestWhereUniqueInput[]
    update?: PromotionRequestUpdateWithWhereUniqueWithoutStudentProfileInput | PromotionRequestUpdateWithWhereUniqueWithoutStudentProfileInput[]
    updateMany?: PromotionRequestUpdateManyWithWhereWithoutStudentProfileInput | PromotionRequestUpdateManyWithWhereWithoutStudentProfileInput[]
    deleteMany?: PromotionRequestScalarWhereInput | PromotionRequestScalarWhereInput[]
  }

  export type StudentSubscriptionUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentSubscriptionCreateWithoutStudentInput, StudentSubscriptionUncheckedCreateWithoutStudentInput> | StudentSubscriptionCreateWithoutStudentInput[] | StudentSubscriptionUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentSubscriptionCreateOrConnectWithoutStudentInput | StudentSubscriptionCreateOrConnectWithoutStudentInput[]
    upsert?: StudentSubscriptionUpsertWithWhereUniqueWithoutStudentInput | StudentSubscriptionUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentSubscriptionCreateManyStudentInputEnvelope
    set?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    disconnect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    delete?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    connect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    update?: StudentSubscriptionUpdateWithWhereUniqueWithoutStudentInput | StudentSubscriptionUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentSubscriptionUpdateManyWithWhereWithoutStudentInput | StudentSubscriptionUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentSubscriptionScalarWhereInput | StudentSubscriptionScalarWhereInput[]
  }

  export type StudentLicenseUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<StudentLicenseCreateWithoutStudentInput, StudentLicenseUncheckedCreateWithoutStudentInput> | StudentLicenseCreateWithoutStudentInput[] | StudentLicenseUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: StudentLicenseCreateOrConnectWithoutStudentInput | StudentLicenseCreateOrConnectWithoutStudentInput[]
    upsert?: StudentLicenseUpsertWithWhereUniqueWithoutStudentInput | StudentLicenseUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: StudentLicenseCreateManyStudentInputEnvelope
    set?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    disconnect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    delete?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    connect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    update?: StudentLicenseUpdateWithWhereUniqueWithoutStudentInput | StudentLicenseUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: StudentLicenseUpdateManyWithWhereWithoutStudentInput | StudentLicenseUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: StudentLicenseScalarWhereInput | StudentLicenseScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutGuardianProfileInput = {
    create?: XOR<UserCreateWithoutGuardianProfileInput, UserUncheckedCreateWithoutGuardianProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutGuardianProfileInput
    connect?: UserWhereUniqueInput
  }

  export type StudentGuardianCreateNestedManyWithoutGuardianInput = {
    create?: XOR<StudentGuardianCreateWithoutGuardianInput, StudentGuardianUncheckedCreateWithoutGuardianInput> | StudentGuardianCreateWithoutGuardianInput[] | StudentGuardianUncheckedCreateWithoutGuardianInput[]
    connectOrCreate?: StudentGuardianCreateOrConnectWithoutGuardianInput | StudentGuardianCreateOrConnectWithoutGuardianInput[]
    createMany?: StudentGuardianCreateManyGuardianInputEnvelope
    connect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
  }

  export type StudentGuardianUncheckedCreateNestedManyWithoutGuardianInput = {
    create?: XOR<StudentGuardianCreateWithoutGuardianInput, StudentGuardianUncheckedCreateWithoutGuardianInput> | StudentGuardianCreateWithoutGuardianInput[] | StudentGuardianUncheckedCreateWithoutGuardianInput[]
    connectOrCreate?: StudentGuardianCreateOrConnectWithoutGuardianInput | StudentGuardianCreateOrConnectWithoutGuardianInput[]
    createMany?: StudentGuardianCreateManyGuardianInputEnvelope
    connect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutGuardianProfileNestedInput = {
    create?: XOR<UserCreateWithoutGuardianProfileInput, UserUncheckedCreateWithoutGuardianProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutGuardianProfileInput
    upsert?: UserUpsertWithoutGuardianProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGuardianProfileInput, UserUpdateWithoutGuardianProfileInput>, UserUncheckedUpdateWithoutGuardianProfileInput>
  }

  export type StudentGuardianUpdateManyWithoutGuardianNestedInput = {
    create?: XOR<StudentGuardianCreateWithoutGuardianInput, StudentGuardianUncheckedCreateWithoutGuardianInput> | StudentGuardianCreateWithoutGuardianInput[] | StudentGuardianUncheckedCreateWithoutGuardianInput[]
    connectOrCreate?: StudentGuardianCreateOrConnectWithoutGuardianInput | StudentGuardianCreateOrConnectWithoutGuardianInput[]
    upsert?: StudentGuardianUpsertWithWhereUniqueWithoutGuardianInput | StudentGuardianUpsertWithWhereUniqueWithoutGuardianInput[]
    createMany?: StudentGuardianCreateManyGuardianInputEnvelope
    set?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    disconnect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    delete?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    connect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    update?: StudentGuardianUpdateWithWhereUniqueWithoutGuardianInput | StudentGuardianUpdateWithWhereUniqueWithoutGuardianInput[]
    updateMany?: StudentGuardianUpdateManyWithWhereWithoutGuardianInput | StudentGuardianUpdateManyWithWhereWithoutGuardianInput[]
    deleteMany?: StudentGuardianScalarWhereInput | StudentGuardianScalarWhereInput[]
  }

  export type StudentGuardianUncheckedUpdateManyWithoutGuardianNestedInput = {
    create?: XOR<StudentGuardianCreateWithoutGuardianInput, StudentGuardianUncheckedCreateWithoutGuardianInput> | StudentGuardianCreateWithoutGuardianInput[] | StudentGuardianUncheckedCreateWithoutGuardianInput[]
    connectOrCreate?: StudentGuardianCreateOrConnectWithoutGuardianInput | StudentGuardianCreateOrConnectWithoutGuardianInput[]
    upsert?: StudentGuardianUpsertWithWhereUniqueWithoutGuardianInput | StudentGuardianUpsertWithWhereUniqueWithoutGuardianInput[]
    createMany?: StudentGuardianCreateManyGuardianInputEnvelope
    set?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    disconnect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    delete?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    connect?: StudentGuardianWhereUniqueInput | StudentGuardianWhereUniqueInput[]
    update?: StudentGuardianUpdateWithWhereUniqueWithoutGuardianInput | StudentGuardianUpdateWithWhereUniqueWithoutGuardianInput[]
    updateMany?: StudentGuardianUpdateManyWithWhereWithoutGuardianInput | StudentGuardianUpdateManyWithWhereWithoutGuardianInput[]
    deleteMany?: StudentGuardianScalarWhereInput | StudentGuardianScalarWhereInput[]
  }

  export type StudentProfileCreateNestedOneWithoutGuardiansInput = {
    create?: XOR<StudentProfileCreateWithoutGuardiansInput, StudentProfileUncheckedCreateWithoutGuardiansInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutGuardiansInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type GuardianCreateNestedOneWithoutStudentsInput = {
    create?: XOR<GuardianCreateWithoutStudentsInput, GuardianUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: GuardianCreateOrConnectWithoutStudentsInput
    connect?: GuardianWhereUniqueInput
  }

  export type StudentProfileUpdateOneRequiredWithoutGuardiansNestedInput = {
    create?: XOR<StudentProfileCreateWithoutGuardiansInput, StudentProfileUncheckedCreateWithoutGuardiansInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutGuardiansInput
    upsert?: StudentProfileUpsertWithoutGuardiansInput
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutGuardiansInput, StudentProfileUpdateWithoutGuardiansInput>, StudentProfileUncheckedUpdateWithoutGuardiansInput>
  }

  export type GuardianUpdateOneRequiredWithoutStudentsNestedInput = {
    create?: XOR<GuardianCreateWithoutStudentsInput, GuardianUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: GuardianCreateOrConnectWithoutStudentsInput
    upsert?: GuardianUpsertWithoutStudentsInput
    connect?: GuardianWhereUniqueInput
    update?: XOR<XOR<GuardianUpdateToOneWithWhereWithoutStudentsInput, GuardianUpdateWithoutStudentsInput>, GuardianUncheckedUpdateWithoutStudentsInput>
  }

  export type DisciplineProgramCreateNestedManyWithoutDisciplineInput = {
    create?: XOR<DisciplineProgramCreateWithoutDisciplineInput, DisciplineProgramUncheckedCreateWithoutDisciplineInput> | DisciplineProgramCreateWithoutDisciplineInput[] | DisciplineProgramUncheckedCreateWithoutDisciplineInput[]
    connectOrCreate?: DisciplineProgramCreateOrConnectWithoutDisciplineInput | DisciplineProgramCreateOrConnectWithoutDisciplineInput[]
    createMany?: DisciplineProgramCreateManyDisciplineInputEnvelope
    connect?: DisciplineProgramWhereUniqueInput | DisciplineProgramWhereUniqueInput[]
  }

  export type DisciplineProgramUncheckedCreateNestedManyWithoutDisciplineInput = {
    create?: XOR<DisciplineProgramCreateWithoutDisciplineInput, DisciplineProgramUncheckedCreateWithoutDisciplineInput> | DisciplineProgramCreateWithoutDisciplineInput[] | DisciplineProgramUncheckedCreateWithoutDisciplineInput[]
    connectOrCreate?: DisciplineProgramCreateOrConnectWithoutDisciplineInput | DisciplineProgramCreateOrConnectWithoutDisciplineInput[]
    createMany?: DisciplineProgramCreateManyDisciplineInputEnvelope
    connect?: DisciplineProgramWhereUniqueInput | DisciplineProgramWhereUniqueInput[]
  }

  export type DisciplineProgramUpdateManyWithoutDisciplineNestedInput = {
    create?: XOR<DisciplineProgramCreateWithoutDisciplineInput, DisciplineProgramUncheckedCreateWithoutDisciplineInput> | DisciplineProgramCreateWithoutDisciplineInput[] | DisciplineProgramUncheckedCreateWithoutDisciplineInput[]
    connectOrCreate?: DisciplineProgramCreateOrConnectWithoutDisciplineInput | DisciplineProgramCreateOrConnectWithoutDisciplineInput[]
    upsert?: DisciplineProgramUpsertWithWhereUniqueWithoutDisciplineInput | DisciplineProgramUpsertWithWhereUniqueWithoutDisciplineInput[]
    createMany?: DisciplineProgramCreateManyDisciplineInputEnvelope
    set?: DisciplineProgramWhereUniqueInput | DisciplineProgramWhereUniqueInput[]
    disconnect?: DisciplineProgramWhereUniqueInput | DisciplineProgramWhereUniqueInput[]
    delete?: DisciplineProgramWhereUniqueInput | DisciplineProgramWhereUniqueInput[]
    connect?: DisciplineProgramWhereUniqueInput | DisciplineProgramWhereUniqueInput[]
    update?: DisciplineProgramUpdateWithWhereUniqueWithoutDisciplineInput | DisciplineProgramUpdateWithWhereUniqueWithoutDisciplineInput[]
    updateMany?: DisciplineProgramUpdateManyWithWhereWithoutDisciplineInput | DisciplineProgramUpdateManyWithWhereWithoutDisciplineInput[]
    deleteMany?: DisciplineProgramScalarWhereInput | DisciplineProgramScalarWhereInput[]
  }

  export type DisciplineProgramUncheckedUpdateManyWithoutDisciplineNestedInput = {
    create?: XOR<DisciplineProgramCreateWithoutDisciplineInput, DisciplineProgramUncheckedCreateWithoutDisciplineInput> | DisciplineProgramCreateWithoutDisciplineInput[] | DisciplineProgramUncheckedCreateWithoutDisciplineInput[]
    connectOrCreate?: DisciplineProgramCreateOrConnectWithoutDisciplineInput | DisciplineProgramCreateOrConnectWithoutDisciplineInput[]
    upsert?: DisciplineProgramUpsertWithWhereUniqueWithoutDisciplineInput | DisciplineProgramUpsertWithWhereUniqueWithoutDisciplineInput[]
    createMany?: DisciplineProgramCreateManyDisciplineInputEnvelope
    set?: DisciplineProgramWhereUniqueInput | DisciplineProgramWhereUniqueInput[]
    disconnect?: DisciplineProgramWhereUniqueInput | DisciplineProgramWhereUniqueInput[]
    delete?: DisciplineProgramWhereUniqueInput | DisciplineProgramWhereUniqueInput[]
    connect?: DisciplineProgramWhereUniqueInput | DisciplineProgramWhereUniqueInput[]
    update?: DisciplineProgramUpdateWithWhereUniqueWithoutDisciplineInput | DisciplineProgramUpdateWithWhereUniqueWithoutDisciplineInput[]
    updateMany?: DisciplineProgramUpdateManyWithWhereWithoutDisciplineInput | DisciplineProgramUpdateManyWithWhereWithoutDisciplineInput[]
    deleteMany?: DisciplineProgramScalarWhereInput | DisciplineProgramScalarWhereInput[]
  }

  export type DisciplineCreateNestedOneWithoutProgramsInput = {
    create?: XOR<DisciplineCreateWithoutProgramsInput, DisciplineUncheckedCreateWithoutProgramsInput>
    connectOrCreate?: DisciplineCreateOrConnectWithoutProgramsInput
    connect?: DisciplineWhereUniqueInput
  }

  export type BeltRankCreateNestedManyWithoutProgramInput = {
    create?: XOR<BeltRankCreateWithoutProgramInput, BeltRankUncheckedCreateWithoutProgramInput> | BeltRankCreateWithoutProgramInput[] | BeltRankUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: BeltRankCreateOrConnectWithoutProgramInput | BeltRankCreateOrConnectWithoutProgramInput[]
    createMany?: BeltRankCreateManyProgramInputEnvelope
    connect?: BeltRankWhereUniqueInput | BeltRankWhereUniqueInput[]
  }

  export type BeltRankUncheckedCreateNestedManyWithoutProgramInput = {
    create?: XOR<BeltRankCreateWithoutProgramInput, BeltRankUncheckedCreateWithoutProgramInput> | BeltRankCreateWithoutProgramInput[] | BeltRankUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: BeltRankCreateOrConnectWithoutProgramInput | BeltRankCreateOrConnectWithoutProgramInput[]
    createMany?: BeltRankCreateManyProgramInputEnvelope
    connect?: BeltRankWhereUniqueInput | BeltRankWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DisciplineUpdateOneRequiredWithoutProgramsNestedInput = {
    create?: XOR<DisciplineCreateWithoutProgramsInput, DisciplineUncheckedCreateWithoutProgramsInput>
    connectOrCreate?: DisciplineCreateOrConnectWithoutProgramsInput
    upsert?: DisciplineUpsertWithoutProgramsInput
    connect?: DisciplineWhereUniqueInput
    update?: XOR<XOR<DisciplineUpdateToOneWithWhereWithoutProgramsInput, DisciplineUpdateWithoutProgramsInput>, DisciplineUncheckedUpdateWithoutProgramsInput>
  }

  export type BeltRankUpdateManyWithoutProgramNestedInput = {
    create?: XOR<BeltRankCreateWithoutProgramInput, BeltRankUncheckedCreateWithoutProgramInput> | BeltRankCreateWithoutProgramInput[] | BeltRankUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: BeltRankCreateOrConnectWithoutProgramInput | BeltRankCreateOrConnectWithoutProgramInput[]
    upsert?: BeltRankUpsertWithWhereUniqueWithoutProgramInput | BeltRankUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: BeltRankCreateManyProgramInputEnvelope
    set?: BeltRankWhereUniqueInput | BeltRankWhereUniqueInput[]
    disconnect?: BeltRankWhereUniqueInput | BeltRankWhereUniqueInput[]
    delete?: BeltRankWhereUniqueInput | BeltRankWhereUniqueInput[]
    connect?: BeltRankWhereUniqueInput | BeltRankWhereUniqueInput[]
    update?: BeltRankUpdateWithWhereUniqueWithoutProgramInput | BeltRankUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: BeltRankUpdateManyWithWhereWithoutProgramInput | BeltRankUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: BeltRankScalarWhereInput | BeltRankScalarWhereInput[]
  }

  export type BeltRankUncheckedUpdateManyWithoutProgramNestedInput = {
    create?: XOR<BeltRankCreateWithoutProgramInput, BeltRankUncheckedCreateWithoutProgramInput> | BeltRankCreateWithoutProgramInput[] | BeltRankUncheckedCreateWithoutProgramInput[]
    connectOrCreate?: BeltRankCreateOrConnectWithoutProgramInput | BeltRankCreateOrConnectWithoutProgramInput[]
    upsert?: BeltRankUpsertWithWhereUniqueWithoutProgramInput | BeltRankUpsertWithWhereUniqueWithoutProgramInput[]
    createMany?: BeltRankCreateManyProgramInputEnvelope
    set?: BeltRankWhereUniqueInput | BeltRankWhereUniqueInput[]
    disconnect?: BeltRankWhereUniqueInput | BeltRankWhereUniqueInput[]
    delete?: BeltRankWhereUniqueInput | BeltRankWhereUniqueInput[]
    connect?: BeltRankWhereUniqueInput | BeltRankWhereUniqueInput[]
    update?: BeltRankUpdateWithWhereUniqueWithoutProgramInput | BeltRankUpdateWithWhereUniqueWithoutProgramInput[]
    updateMany?: BeltRankUpdateManyWithWhereWithoutProgramInput | BeltRankUpdateManyWithWhereWithoutProgramInput[]
    deleteMany?: BeltRankScalarWhereInput | BeltRankScalarWhereInput[]
  }

  export type DisciplineProgramCreateNestedOneWithoutBeltRanksInput = {
    create?: XOR<DisciplineProgramCreateWithoutBeltRanksInput, DisciplineProgramUncheckedCreateWithoutBeltRanksInput>
    connectOrCreate?: DisciplineProgramCreateOrConnectWithoutBeltRanksInput
    connect?: DisciplineProgramWhereUniqueInput
  }

  export type StudentRankCreateNestedManyWithoutBeltRankInput = {
    create?: XOR<StudentRankCreateWithoutBeltRankInput, StudentRankUncheckedCreateWithoutBeltRankInput> | StudentRankCreateWithoutBeltRankInput[] | StudentRankUncheckedCreateWithoutBeltRankInput[]
    connectOrCreate?: StudentRankCreateOrConnectWithoutBeltRankInput | StudentRankCreateOrConnectWithoutBeltRankInput[]
    createMany?: StudentRankCreateManyBeltRankInputEnvelope
    connect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
  }

  export type StudentRankUncheckedCreateNestedManyWithoutBeltRankInput = {
    create?: XOR<StudentRankCreateWithoutBeltRankInput, StudentRankUncheckedCreateWithoutBeltRankInput> | StudentRankCreateWithoutBeltRankInput[] | StudentRankUncheckedCreateWithoutBeltRankInput[]
    connectOrCreate?: StudentRankCreateOrConnectWithoutBeltRankInput | StudentRankCreateOrConnectWithoutBeltRankInput[]
    createMany?: StudentRankCreateManyBeltRankInputEnvelope
    connect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
  }

  export type DisciplineProgramUpdateOneRequiredWithoutBeltRanksNestedInput = {
    create?: XOR<DisciplineProgramCreateWithoutBeltRanksInput, DisciplineProgramUncheckedCreateWithoutBeltRanksInput>
    connectOrCreate?: DisciplineProgramCreateOrConnectWithoutBeltRanksInput
    upsert?: DisciplineProgramUpsertWithoutBeltRanksInput
    connect?: DisciplineProgramWhereUniqueInput
    update?: XOR<XOR<DisciplineProgramUpdateToOneWithWhereWithoutBeltRanksInput, DisciplineProgramUpdateWithoutBeltRanksInput>, DisciplineProgramUncheckedUpdateWithoutBeltRanksInput>
  }

  export type StudentRankUpdateManyWithoutBeltRankNestedInput = {
    create?: XOR<StudentRankCreateWithoutBeltRankInput, StudentRankUncheckedCreateWithoutBeltRankInput> | StudentRankCreateWithoutBeltRankInput[] | StudentRankUncheckedCreateWithoutBeltRankInput[]
    connectOrCreate?: StudentRankCreateOrConnectWithoutBeltRankInput | StudentRankCreateOrConnectWithoutBeltRankInput[]
    upsert?: StudentRankUpsertWithWhereUniqueWithoutBeltRankInput | StudentRankUpsertWithWhereUniqueWithoutBeltRankInput[]
    createMany?: StudentRankCreateManyBeltRankInputEnvelope
    set?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    disconnect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    delete?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    connect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    update?: StudentRankUpdateWithWhereUniqueWithoutBeltRankInput | StudentRankUpdateWithWhereUniqueWithoutBeltRankInput[]
    updateMany?: StudentRankUpdateManyWithWhereWithoutBeltRankInput | StudentRankUpdateManyWithWhereWithoutBeltRankInput[]
    deleteMany?: StudentRankScalarWhereInput | StudentRankScalarWhereInput[]
  }

  export type StudentRankUncheckedUpdateManyWithoutBeltRankNestedInput = {
    create?: XOR<StudentRankCreateWithoutBeltRankInput, StudentRankUncheckedCreateWithoutBeltRankInput> | StudentRankCreateWithoutBeltRankInput[] | StudentRankUncheckedCreateWithoutBeltRankInput[]
    connectOrCreate?: StudentRankCreateOrConnectWithoutBeltRankInput | StudentRankCreateOrConnectWithoutBeltRankInput[]
    upsert?: StudentRankUpsertWithWhereUniqueWithoutBeltRankInput | StudentRankUpsertWithWhereUniqueWithoutBeltRankInput[]
    createMany?: StudentRankCreateManyBeltRankInputEnvelope
    set?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    disconnect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    delete?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    connect?: StudentRankWhereUniqueInput | StudentRankWhereUniqueInput[]
    update?: StudentRankUpdateWithWhereUniqueWithoutBeltRankInput | StudentRankUpdateWithWhereUniqueWithoutBeltRankInput[]
    updateMany?: StudentRankUpdateManyWithWhereWithoutBeltRankInput | StudentRankUpdateManyWithWhereWithoutBeltRankInput[]
    deleteMany?: StudentRankScalarWhereInput | StudentRankScalarWhereInput[]
  }

  export type StudentProfileCreateNestedOneWithoutRanksInput = {
    create?: XOR<StudentProfileCreateWithoutRanksInput, StudentProfileUncheckedCreateWithoutRanksInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutRanksInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type BeltRankCreateNestedOneWithoutStudentRanksInput = {
    create?: XOR<BeltRankCreateWithoutStudentRanksInput, BeltRankUncheckedCreateWithoutStudentRanksInput>
    connectOrCreate?: BeltRankCreateOrConnectWithoutStudentRanksInput
    connect?: BeltRankWhereUniqueInput
  }

  export type StudentProfileUpdateOneRequiredWithoutRanksNestedInput = {
    create?: XOR<StudentProfileCreateWithoutRanksInput, StudentProfileUncheckedCreateWithoutRanksInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutRanksInput
    upsert?: StudentProfileUpsertWithoutRanksInput
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutRanksInput, StudentProfileUpdateWithoutRanksInput>, StudentProfileUncheckedUpdateWithoutRanksInput>
  }

  export type BeltRankUpdateOneRequiredWithoutStudentRanksNestedInput = {
    create?: XOR<BeltRankCreateWithoutStudentRanksInput, BeltRankUncheckedCreateWithoutStudentRanksInput>
    connectOrCreate?: BeltRankCreateOrConnectWithoutStudentRanksInput
    upsert?: BeltRankUpsertWithoutStudentRanksInput
    connect?: BeltRankWhereUniqueInput
    update?: XOR<XOR<BeltRankUpdateToOneWithWhereWithoutStudentRanksInput, BeltRankUpdateWithoutStudentRanksInput>, BeltRankUncheckedUpdateWithoutStudentRanksInput>
  }

  export type StudentProfileCreateNestedOneWithoutAttendancesInput = {
    create?: XOR<StudentProfileCreateWithoutAttendancesInput, StudentProfileUncheckedCreateWithoutAttendancesInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutAttendancesInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type StudentProfileUpdateOneRequiredWithoutAttendancesNestedInput = {
    create?: XOR<StudentProfileCreateWithoutAttendancesInput, StudentProfileUncheckedCreateWithoutAttendancesInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutAttendancesInput
    upsert?: StudentProfileUpsertWithoutAttendancesInput
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutAttendancesInput, StudentProfileUpdateWithoutAttendancesInput>, StudentProfileUncheckedUpdateWithoutAttendancesInput>
  }

  export type StudentProfileCreateNestedOneWithoutUpdateRequestsInput = {
    create?: XOR<StudentProfileCreateWithoutUpdateRequestsInput, StudentProfileUncheckedCreateWithoutUpdateRequestsInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutUpdateRequestsInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReviewedUpdatesInput = {
    create?: XOR<UserCreateWithoutReviewedUpdatesInput, UserUncheckedCreateWithoutReviewedUpdatesInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewedUpdatesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.RequestStatus
  }

  export type StudentProfileUpdateOneRequiredWithoutUpdateRequestsNestedInput = {
    create?: XOR<StudentProfileCreateWithoutUpdateRequestsInput, StudentProfileUncheckedCreateWithoutUpdateRequestsInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutUpdateRequestsInput
    upsert?: StudentProfileUpsertWithoutUpdateRequestsInput
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutUpdateRequestsInput, StudentProfileUpdateWithoutUpdateRequestsInput>, StudentProfileUncheckedUpdateWithoutUpdateRequestsInput>
  }

  export type UserUpdateOneWithoutReviewedUpdatesNestedInput = {
    create?: XOR<UserCreateWithoutReviewedUpdatesInput, UserUncheckedCreateWithoutReviewedUpdatesInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewedUpdatesInput
    upsert?: UserUpsertWithoutReviewedUpdatesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReviewedUpdatesInput, UserUpdateWithoutReviewedUpdatesInput>, UserUncheckedUpdateWithoutReviewedUpdatesInput>
  }

  export type StudentProfileCreateNestedOneWithoutPromotionRequestsInput = {
    create?: XOR<StudentProfileCreateWithoutPromotionRequestsInput, StudentProfileUncheckedCreateWithoutPromotionRequestsInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutPromotionRequestsInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutProposedPromotionsInput = {
    create?: XOR<UserCreateWithoutProposedPromotionsInput, UserUncheckedCreateWithoutProposedPromotionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProposedPromotionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutApprovedPromotionsInput = {
    create?: XOR<UserCreateWithoutApprovedPromotionsInput, UserUncheckedCreateWithoutApprovedPromotionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutApprovedPromotionsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StudentProfileUpdateOneRequiredWithoutPromotionRequestsNestedInput = {
    create?: XOR<StudentProfileCreateWithoutPromotionRequestsInput, StudentProfileUncheckedCreateWithoutPromotionRequestsInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutPromotionRequestsInput
    upsert?: StudentProfileUpsertWithoutPromotionRequestsInput
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutPromotionRequestsInput, StudentProfileUpdateWithoutPromotionRequestsInput>, StudentProfileUncheckedUpdateWithoutPromotionRequestsInput>
  }

  export type UserUpdateOneRequiredWithoutProposedPromotionsNestedInput = {
    create?: XOR<UserCreateWithoutProposedPromotionsInput, UserUncheckedCreateWithoutProposedPromotionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProposedPromotionsInput
    upsert?: UserUpsertWithoutProposedPromotionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProposedPromotionsInput, UserUpdateWithoutProposedPromotionsInput>, UserUncheckedUpdateWithoutProposedPromotionsInput>
  }

  export type UserUpdateOneWithoutApprovedPromotionsNestedInput = {
    create?: XOR<UserCreateWithoutApprovedPromotionsInput, UserUncheckedCreateWithoutApprovedPromotionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutApprovedPromotionsInput
    upsert?: UserUpsertWithoutApprovedPromotionsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutApprovedPromotionsInput, UserUpdateWithoutApprovedPromotionsInput>, UserUncheckedUpdateWithoutApprovedPromotionsInput>
  }

  export type StudentSubscriptionCreateNestedManyWithoutFeePlanInput = {
    create?: XOR<StudentSubscriptionCreateWithoutFeePlanInput, StudentSubscriptionUncheckedCreateWithoutFeePlanInput> | StudentSubscriptionCreateWithoutFeePlanInput[] | StudentSubscriptionUncheckedCreateWithoutFeePlanInput[]
    connectOrCreate?: StudentSubscriptionCreateOrConnectWithoutFeePlanInput | StudentSubscriptionCreateOrConnectWithoutFeePlanInput[]
    createMany?: StudentSubscriptionCreateManyFeePlanInputEnvelope
    connect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
  }

  export type StudentSubscriptionUncheckedCreateNestedManyWithoutFeePlanInput = {
    create?: XOR<StudentSubscriptionCreateWithoutFeePlanInput, StudentSubscriptionUncheckedCreateWithoutFeePlanInput> | StudentSubscriptionCreateWithoutFeePlanInput[] | StudentSubscriptionUncheckedCreateWithoutFeePlanInput[]
    connectOrCreate?: StudentSubscriptionCreateOrConnectWithoutFeePlanInput | StudentSubscriptionCreateOrConnectWithoutFeePlanInput[]
    createMany?: StudentSubscriptionCreateManyFeePlanInputEnvelope
    connect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StudentSubscriptionUpdateManyWithoutFeePlanNestedInput = {
    create?: XOR<StudentSubscriptionCreateWithoutFeePlanInput, StudentSubscriptionUncheckedCreateWithoutFeePlanInput> | StudentSubscriptionCreateWithoutFeePlanInput[] | StudentSubscriptionUncheckedCreateWithoutFeePlanInput[]
    connectOrCreate?: StudentSubscriptionCreateOrConnectWithoutFeePlanInput | StudentSubscriptionCreateOrConnectWithoutFeePlanInput[]
    upsert?: StudentSubscriptionUpsertWithWhereUniqueWithoutFeePlanInput | StudentSubscriptionUpsertWithWhereUniqueWithoutFeePlanInput[]
    createMany?: StudentSubscriptionCreateManyFeePlanInputEnvelope
    set?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    disconnect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    delete?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    connect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    update?: StudentSubscriptionUpdateWithWhereUniqueWithoutFeePlanInput | StudentSubscriptionUpdateWithWhereUniqueWithoutFeePlanInput[]
    updateMany?: StudentSubscriptionUpdateManyWithWhereWithoutFeePlanInput | StudentSubscriptionUpdateManyWithWhereWithoutFeePlanInput[]
    deleteMany?: StudentSubscriptionScalarWhereInput | StudentSubscriptionScalarWhereInput[]
  }

  export type StudentSubscriptionUncheckedUpdateManyWithoutFeePlanNestedInput = {
    create?: XOR<StudentSubscriptionCreateWithoutFeePlanInput, StudentSubscriptionUncheckedCreateWithoutFeePlanInput> | StudentSubscriptionCreateWithoutFeePlanInput[] | StudentSubscriptionUncheckedCreateWithoutFeePlanInput[]
    connectOrCreate?: StudentSubscriptionCreateOrConnectWithoutFeePlanInput | StudentSubscriptionCreateOrConnectWithoutFeePlanInput[]
    upsert?: StudentSubscriptionUpsertWithWhereUniqueWithoutFeePlanInput | StudentSubscriptionUpsertWithWhereUniqueWithoutFeePlanInput[]
    createMany?: StudentSubscriptionCreateManyFeePlanInputEnvelope
    set?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    disconnect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    delete?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    connect?: StudentSubscriptionWhereUniqueInput | StudentSubscriptionWhereUniqueInput[]
    update?: StudentSubscriptionUpdateWithWhereUniqueWithoutFeePlanInput | StudentSubscriptionUpdateWithWhereUniqueWithoutFeePlanInput[]
    updateMany?: StudentSubscriptionUpdateManyWithWhereWithoutFeePlanInput | StudentSubscriptionUpdateManyWithWhereWithoutFeePlanInput[]
    deleteMany?: StudentSubscriptionScalarWhereInput | StudentSubscriptionScalarWhereInput[]
  }

  export type StudentProfileCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<StudentProfileCreateWithoutSubscriptionsInput, StudentProfileUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutSubscriptionsInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type FeePlanCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<FeePlanCreateWithoutSubscriptionsInput, FeePlanUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: FeePlanCreateOrConnectWithoutSubscriptionsInput
    connect?: FeePlanWhereUniqueInput
  }

  export type StudentProfileUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<StudentProfileCreateWithoutSubscriptionsInput, StudentProfileUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutSubscriptionsInput
    upsert?: StudentProfileUpsertWithoutSubscriptionsInput
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutSubscriptionsInput, StudentProfileUpdateWithoutSubscriptionsInput>, StudentProfileUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type FeePlanUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<FeePlanCreateWithoutSubscriptionsInput, FeePlanUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: FeePlanCreateOrConnectWithoutSubscriptionsInput
    upsert?: FeePlanUpsertWithoutSubscriptionsInput
    connect?: FeePlanWhereUniqueInput
    update?: XOR<XOR<FeePlanUpdateToOneWithWhereWithoutSubscriptionsInput, FeePlanUpdateWithoutSubscriptionsInput>, FeePlanUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type StudentLicenseCreateNestedManyWithoutFederationInput = {
    create?: XOR<StudentLicenseCreateWithoutFederationInput, StudentLicenseUncheckedCreateWithoutFederationInput> | StudentLicenseCreateWithoutFederationInput[] | StudentLicenseUncheckedCreateWithoutFederationInput[]
    connectOrCreate?: StudentLicenseCreateOrConnectWithoutFederationInput | StudentLicenseCreateOrConnectWithoutFederationInput[]
    createMany?: StudentLicenseCreateManyFederationInputEnvelope
    connect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
  }

  export type StudentLicenseUncheckedCreateNestedManyWithoutFederationInput = {
    create?: XOR<StudentLicenseCreateWithoutFederationInput, StudentLicenseUncheckedCreateWithoutFederationInput> | StudentLicenseCreateWithoutFederationInput[] | StudentLicenseUncheckedCreateWithoutFederationInput[]
    connectOrCreate?: StudentLicenseCreateOrConnectWithoutFederationInput | StudentLicenseCreateOrConnectWithoutFederationInput[]
    createMany?: StudentLicenseCreateManyFederationInputEnvelope
    connect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
  }

  export type StudentLicenseUpdateManyWithoutFederationNestedInput = {
    create?: XOR<StudentLicenseCreateWithoutFederationInput, StudentLicenseUncheckedCreateWithoutFederationInput> | StudentLicenseCreateWithoutFederationInput[] | StudentLicenseUncheckedCreateWithoutFederationInput[]
    connectOrCreate?: StudentLicenseCreateOrConnectWithoutFederationInput | StudentLicenseCreateOrConnectWithoutFederationInput[]
    upsert?: StudentLicenseUpsertWithWhereUniqueWithoutFederationInput | StudentLicenseUpsertWithWhereUniqueWithoutFederationInput[]
    createMany?: StudentLicenseCreateManyFederationInputEnvelope
    set?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    disconnect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    delete?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    connect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    update?: StudentLicenseUpdateWithWhereUniqueWithoutFederationInput | StudentLicenseUpdateWithWhereUniqueWithoutFederationInput[]
    updateMany?: StudentLicenseUpdateManyWithWhereWithoutFederationInput | StudentLicenseUpdateManyWithWhereWithoutFederationInput[]
    deleteMany?: StudentLicenseScalarWhereInput | StudentLicenseScalarWhereInput[]
  }

  export type StudentLicenseUncheckedUpdateManyWithoutFederationNestedInput = {
    create?: XOR<StudentLicenseCreateWithoutFederationInput, StudentLicenseUncheckedCreateWithoutFederationInput> | StudentLicenseCreateWithoutFederationInput[] | StudentLicenseUncheckedCreateWithoutFederationInput[]
    connectOrCreate?: StudentLicenseCreateOrConnectWithoutFederationInput | StudentLicenseCreateOrConnectWithoutFederationInput[]
    upsert?: StudentLicenseUpsertWithWhereUniqueWithoutFederationInput | StudentLicenseUpsertWithWhereUniqueWithoutFederationInput[]
    createMany?: StudentLicenseCreateManyFederationInputEnvelope
    set?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    disconnect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    delete?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    connect?: StudentLicenseWhereUniqueInput | StudentLicenseWhereUniqueInput[]
    update?: StudentLicenseUpdateWithWhereUniqueWithoutFederationInput | StudentLicenseUpdateWithWhereUniqueWithoutFederationInput[]
    updateMany?: StudentLicenseUpdateManyWithWhereWithoutFederationInput | StudentLicenseUpdateManyWithWhereWithoutFederationInput[]
    deleteMany?: StudentLicenseScalarWhereInput | StudentLicenseScalarWhereInput[]
  }

  export type StudentProfileCreateNestedOneWithoutLicensesInput = {
    create?: XOR<StudentProfileCreateWithoutLicensesInput, StudentProfileUncheckedCreateWithoutLicensesInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutLicensesInput
    connect?: StudentProfileWhereUniqueInput
  }

  export type FederationCreateNestedOneWithoutLicensesInput = {
    create?: XOR<FederationCreateWithoutLicensesInput, FederationUncheckedCreateWithoutLicensesInput>
    connectOrCreate?: FederationCreateOrConnectWithoutLicensesInput
    connect?: FederationWhereUniqueInput
  }

  export type StudentProfileUpdateOneRequiredWithoutLicensesNestedInput = {
    create?: XOR<StudentProfileCreateWithoutLicensesInput, StudentProfileUncheckedCreateWithoutLicensesInput>
    connectOrCreate?: StudentProfileCreateOrConnectWithoutLicensesInput
    upsert?: StudentProfileUpsertWithoutLicensesInput
    connect?: StudentProfileWhereUniqueInput
    update?: XOR<XOR<StudentProfileUpdateToOneWithWhereWithoutLicensesInput, StudentProfileUpdateWithoutLicensesInput>, StudentProfileUncheckedUpdateWithoutLicensesInput>
  }

  export type FederationUpdateOneRequiredWithoutLicensesNestedInput = {
    create?: XOR<FederationCreateWithoutLicensesInput, FederationUncheckedCreateWithoutLicensesInput>
    connectOrCreate?: FederationCreateOrConnectWithoutLicensesInput
    upsert?: FederationUpsertWithoutLicensesInput
    connect?: FederationWhereUniqueInput
    update?: XOR<XOR<FederationUpdateToOneWithWhereWithoutLicensesInput, FederationUpdateWithoutLicensesInput>, FederationUncheckedUpdateWithoutLicensesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumRequestStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type StudentProfileCreateWithoutUserInput = {
    id?: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    guardians?: StudentGuardianCreateNestedManyWithoutStudentInput
    ranks?: StudentRankCreateNestedManyWithoutStudentInput
    attendances?: AttendanceCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileUncheckedCreateWithoutUserInput = {
    id?: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    guardians?: StudentGuardianUncheckedCreateNestedManyWithoutStudentInput
    ranks?: StudentRankUncheckedCreateNestedManyWithoutStudentInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionUncheckedCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileCreateOrConnectWithoutUserInput = {
    where: StudentProfileWhereUniqueInput
    create: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
  }

  export type GuardianCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    students?: StudentGuardianCreateNestedManyWithoutGuardianInput
  }

  export type GuardianUncheckedCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    students?: StudentGuardianUncheckedCreateNestedManyWithoutGuardianInput
  }

  export type GuardianCreateOrConnectWithoutUserInput = {
    where: GuardianWhereUniqueInput
    create: XOR<GuardianCreateWithoutUserInput, GuardianUncheckedCreateWithoutUserInput>
  }

  export type ProfileUpdateRequestCreateWithoutReviewerInput = {
    id?: string
    requestedChanges: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile: StudentProfileCreateNestedOneWithoutUpdateRequestsInput
  }

  export type ProfileUpdateRequestUncheckedCreateWithoutReviewerInput = {
    id?: string
    studentProfileId: string
    requestedChanges: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateRequestCreateOrConnectWithoutReviewerInput = {
    where: ProfileUpdateRequestWhereUniqueInput
    create: XOR<ProfileUpdateRequestCreateWithoutReviewerInput, ProfileUpdateRequestUncheckedCreateWithoutReviewerInput>
  }

  export type ProfileUpdateRequestCreateManyReviewerInputEnvelope = {
    data: ProfileUpdateRequestCreateManyReviewerInput | ProfileUpdateRequestCreateManyReviewerInput[]
    skipDuplicates?: boolean
  }

  export type PromotionRequestCreateWithoutProposedByInput = {
    id?: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    studentProfile: StudentProfileCreateNestedOneWithoutPromotionRequestsInput
    approvedBy?: UserCreateNestedOneWithoutApprovedPromotionsInput
  }

  export type PromotionRequestUncheckedCreateWithoutProposedByInput = {
    id?: string
    studentProfileId: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    approvedById?: string | null
    status?: $Enums.RequestStatus
    createdAt?: Date | string
  }

  export type PromotionRequestCreateOrConnectWithoutProposedByInput = {
    where: PromotionRequestWhereUniqueInput
    create: XOR<PromotionRequestCreateWithoutProposedByInput, PromotionRequestUncheckedCreateWithoutProposedByInput>
  }

  export type PromotionRequestCreateManyProposedByInputEnvelope = {
    data: PromotionRequestCreateManyProposedByInput | PromotionRequestCreateManyProposedByInput[]
    skipDuplicates?: boolean
  }

  export type PromotionRequestCreateWithoutApprovedByInput = {
    id?: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    studentProfile: StudentProfileCreateNestedOneWithoutPromotionRequestsInput
    proposedBy: UserCreateNestedOneWithoutProposedPromotionsInput
  }

  export type PromotionRequestUncheckedCreateWithoutApprovedByInput = {
    id?: string
    studentProfileId: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    proposedById: string
    status?: $Enums.RequestStatus
    createdAt?: Date | string
  }

  export type PromotionRequestCreateOrConnectWithoutApprovedByInput = {
    where: PromotionRequestWhereUniqueInput
    create: XOR<PromotionRequestCreateWithoutApprovedByInput, PromotionRequestUncheckedCreateWithoutApprovedByInput>
  }

  export type PromotionRequestCreateManyApprovedByInputEnvelope = {
    data: PromotionRequestCreateManyApprovedByInput | PromotionRequestCreateManyApprovedByInput[]
    skipDuplicates?: boolean
  }

  export type StudentProfileUpsertWithoutUserInput = {
    update: XOR<StudentProfileUpdateWithoutUserInput, StudentProfileUncheckedUpdateWithoutUserInput>
    create: XOR<StudentProfileCreateWithoutUserInput, StudentProfileUncheckedCreateWithoutUserInput>
    where?: StudentProfileWhereInput
  }

  export type StudentProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: StudentProfileWhereInput
    data: XOR<StudentProfileUpdateWithoutUserInput, StudentProfileUncheckedUpdateWithoutUserInput>
  }

  export type StudentProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guardians?: StudentGuardianUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guardians?: StudentGuardianUncheckedUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUncheckedUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUncheckedUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type GuardianUpsertWithoutUserInput = {
    update: XOR<GuardianUpdateWithoutUserInput, GuardianUncheckedUpdateWithoutUserInput>
    create: XOR<GuardianCreateWithoutUserInput, GuardianUncheckedCreateWithoutUserInput>
    where?: GuardianWhereInput
  }

  export type GuardianUpdateToOneWithWhereWithoutUserInput = {
    where?: GuardianWhereInput
    data: XOR<GuardianUpdateWithoutUserInput, GuardianUncheckedUpdateWithoutUserInput>
  }

  export type GuardianUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentGuardianUpdateManyWithoutGuardianNestedInput
  }

  export type GuardianUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    students?: StudentGuardianUncheckedUpdateManyWithoutGuardianNestedInput
  }

  export type ProfileUpdateRequestUpsertWithWhereUniqueWithoutReviewerInput = {
    where: ProfileUpdateRequestWhereUniqueInput
    update: XOR<ProfileUpdateRequestUpdateWithoutReviewerInput, ProfileUpdateRequestUncheckedUpdateWithoutReviewerInput>
    create: XOR<ProfileUpdateRequestCreateWithoutReviewerInput, ProfileUpdateRequestUncheckedCreateWithoutReviewerInput>
  }

  export type ProfileUpdateRequestUpdateWithWhereUniqueWithoutReviewerInput = {
    where: ProfileUpdateRequestWhereUniqueInput
    data: XOR<ProfileUpdateRequestUpdateWithoutReviewerInput, ProfileUpdateRequestUncheckedUpdateWithoutReviewerInput>
  }

  export type ProfileUpdateRequestUpdateManyWithWhereWithoutReviewerInput = {
    where: ProfileUpdateRequestScalarWhereInput
    data: XOR<ProfileUpdateRequestUpdateManyMutationInput, ProfileUpdateRequestUncheckedUpdateManyWithoutReviewerInput>
  }

  export type ProfileUpdateRequestScalarWhereInput = {
    AND?: ProfileUpdateRequestScalarWhereInput | ProfileUpdateRequestScalarWhereInput[]
    OR?: ProfileUpdateRequestScalarWhereInput[]
    NOT?: ProfileUpdateRequestScalarWhereInput | ProfileUpdateRequestScalarWhereInput[]
    id?: StringFilter<"ProfileUpdateRequest"> | string
    studentProfileId?: StringFilter<"ProfileUpdateRequest"> | string
    requestedChanges?: JsonFilter<"ProfileUpdateRequest">
    status?: EnumRequestStatusFilter<"ProfileUpdateRequest"> | $Enums.RequestStatus
    reviewedById?: StringNullableFilter<"ProfileUpdateRequest"> | string | null
    createdAt?: DateTimeFilter<"ProfileUpdateRequest"> | Date | string
    updatedAt?: DateTimeFilter<"ProfileUpdateRequest"> | Date | string
  }

  export type PromotionRequestUpsertWithWhereUniqueWithoutProposedByInput = {
    where: PromotionRequestWhereUniqueInput
    update: XOR<PromotionRequestUpdateWithoutProposedByInput, PromotionRequestUncheckedUpdateWithoutProposedByInput>
    create: XOR<PromotionRequestCreateWithoutProposedByInput, PromotionRequestUncheckedCreateWithoutProposedByInput>
  }

  export type PromotionRequestUpdateWithWhereUniqueWithoutProposedByInput = {
    where: PromotionRequestWhereUniqueInput
    data: XOR<PromotionRequestUpdateWithoutProposedByInput, PromotionRequestUncheckedUpdateWithoutProposedByInput>
  }

  export type PromotionRequestUpdateManyWithWhereWithoutProposedByInput = {
    where: PromotionRequestScalarWhereInput
    data: XOR<PromotionRequestUpdateManyMutationInput, PromotionRequestUncheckedUpdateManyWithoutProposedByInput>
  }

  export type PromotionRequestScalarWhereInput = {
    AND?: PromotionRequestScalarWhereInput | PromotionRequestScalarWhereInput[]
    OR?: PromotionRequestScalarWhereInput[]
    NOT?: PromotionRequestScalarWhereInput | PromotionRequestScalarWhereInput[]
    id?: StringFilter<"PromotionRequest"> | string
    studentProfileId?: StringFilter<"PromotionRequest"> | string
    proposedBeltId?: StringNullableFilter<"PromotionRequest"> | string | null
    proposedStripes?: IntNullableFilter<"PromotionRequest"> | number | null
    proposedById?: StringFilter<"PromotionRequest"> | string
    approvedById?: StringNullableFilter<"PromotionRequest"> | string | null
    status?: EnumRequestStatusFilter<"PromotionRequest"> | $Enums.RequestStatus
    createdAt?: DateTimeFilter<"PromotionRequest"> | Date | string
  }

  export type PromotionRequestUpsertWithWhereUniqueWithoutApprovedByInput = {
    where: PromotionRequestWhereUniqueInput
    update: XOR<PromotionRequestUpdateWithoutApprovedByInput, PromotionRequestUncheckedUpdateWithoutApprovedByInput>
    create: XOR<PromotionRequestCreateWithoutApprovedByInput, PromotionRequestUncheckedCreateWithoutApprovedByInput>
  }

  export type PromotionRequestUpdateWithWhereUniqueWithoutApprovedByInput = {
    where: PromotionRequestWhereUniqueInput
    data: XOR<PromotionRequestUpdateWithoutApprovedByInput, PromotionRequestUncheckedUpdateWithoutApprovedByInput>
  }

  export type PromotionRequestUpdateManyWithWhereWithoutApprovedByInput = {
    where: PromotionRequestScalarWhereInput
    data: XOR<PromotionRequestUpdateManyMutationInput, PromotionRequestUncheckedUpdateManyWithoutApprovedByInput>
  }

  export type UserCreateWithoutStudentProfileInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    guardianProfile?: GuardianCreateNestedOneWithoutUserInput
    reviewedUpdates?: ProfileUpdateRequestCreateNestedManyWithoutReviewerInput
    proposedPromotions?: PromotionRequestCreateNestedManyWithoutProposedByInput
    approvedPromotions?: PromotionRequestCreateNestedManyWithoutApprovedByInput
  }

  export type UserUncheckedCreateWithoutStudentProfileInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    guardianProfile?: GuardianUncheckedCreateNestedOneWithoutUserInput
    reviewedUpdates?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutReviewerInput
    proposedPromotions?: PromotionRequestUncheckedCreateNestedManyWithoutProposedByInput
    approvedPromotions?: PromotionRequestUncheckedCreateNestedManyWithoutApprovedByInput
  }

  export type UserCreateOrConnectWithoutStudentProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStudentProfileInput, UserUncheckedCreateWithoutStudentProfileInput>
  }

  export type StudentGuardianCreateWithoutStudentInput = {
    relationship?: string | null
    guardian: GuardianCreateNestedOneWithoutStudentsInput
  }

  export type StudentGuardianUncheckedCreateWithoutStudentInput = {
    guardianId: string
    relationship?: string | null
  }

  export type StudentGuardianCreateOrConnectWithoutStudentInput = {
    where: StudentGuardianWhereUniqueInput
    create: XOR<StudentGuardianCreateWithoutStudentInput, StudentGuardianUncheckedCreateWithoutStudentInput>
  }

  export type StudentGuardianCreateManyStudentInputEnvelope = {
    data: StudentGuardianCreateManyStudentInput | StudentGuardianCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type StudentRankCreateWithoutStudentInput = {
    id?: string
    currentStripes?: number
    accumulatedHours?: number
    promotedAt?: Date | string
    lastStripeAt?: Date | string
    beltRank: BeltRankCreateNestedOneWithoutStudentRanksInput
  }

  export type StudentRankUncheckedCreateWithoutStudentInput = {
    id?: string
    beltRankId: string
    currentStripes?: number
    accumulatedHours?: number
    promotedAt?: Date | string
    lastStripeAt?: Date | string
  }

  export type StudentRankCreateOrConnectWithoutStudentInput = {
    where: StudentRankWhereUniqueInput
    create: XOR<StudentRankCreateWithoutStudentInput, StudentRankUncheckedCreateWithoutStudentInput>
  }

  export type StudentRankCreateManyStudentInputEnvelope = {
    data: StudentRankCreateManyStudentInput | StudentRankCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type AttendanceCreateWithoutStudentInput = {
    id?: string
    date?: Date | string
    countedForRank?: boolean
  }

  export type AttendanceUncheckedCreateWithoutStudentInput = {
    id?: string
    date?: Date | string
    countedForRank?: boolean
  }

  export type AttendanceCreateOrConnectWithoutStudentInput = {
    where: AttendanceWhereUniqueInput
    create: XOR<AttendanceCreateWithoutStudentInput, AttendanceUncheckedCreateWithoutStudentInput>
  }

  export type AttendanceCreateManyStudentInputEnvelope = {
    data: AttendanceCreateManyStudentInput | AttendanceCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type ProfileUpdateRequestCreateWithoutStudentProfileInput = {
    id?: string
    requestedChanges: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    reviewer?: UserCreateNestedOneWithoutReviewedUpdatesInput
  }

  export type ProfileUpdateRequestUncheckedCreateWithoutStudentProfileInput = {
    id?: string
    requestedChanges: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    reviewedById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateRequestCreateOrConnectWithoutStudentProfileInput = {
    where: ProfileUpdateRequestWhereUniqueInput
    create: XOR<ProfileUpdateRequestCreateWithoutStudentProfileInput, ProfileUpdateRequestUncheckedCreateWithoutStudentProfileInput>
  }

  export type ProfileUpdateRequestCreateManyStudentProfileInputEnvelope = {
    data: ProfileUpdateRequestCreateManyStudentProfileInput | ProfileUpdateRequestCreateManyStudentProfileInput[]
    skipDuplicates?: boolean
  }

  export type PromotionRequestCreateWithoutStudentProfileInput = {
    id?: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    proposedBy: UserCreateNestedOneWithoutProposedPromotionsInput
    approvedBy?: UserCreateNestedOneWithoutApprovedPromotionsInput
  }

  export type PromotionRequestUncheckedCreateWithoutStudentProfileInput = {
    id?: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    proposedById: string
    approvedById?: string | null
    status?: $Enums.RequestStatus
    createdAt?: Date | string
  }

  export type PromotionRequestCreateOrConnectWithoutStudentProfileInput = {
    where: PromotionRequestWhereUniqueInput
    create: XOR<PromotionRequestCreateWithoutStudentProfileInput, PromotionRequestUncheckedCreateWithoutStudentProfileInput>
  }

  export type PromotionRequestCreateManyStudentProfileInputEnvelope = {
    data: PromotionRequestCreateManyStudentProfileInput | PromotionRequestCreateManyStudentProfileInput[]
    skipDuplicates?: boolean
  }

  export type StudentSubscriptionCreateWithoutStudentInput = {
    id?: string
    isActive?: boolean
    mandateReference?: string | null
    feePlan: FeePlanCreateNestedOneWithoutSubscriptionsInput
  }

  export type StudentSubscriptionUncheckedCreateWithoutStudentInput = {
    id?: string
    feePlanId: string
    isActive?: boolean
    mandateReference?: string | null
  }

  export type StudentSubscriptionCreateOrConnectWithoutStudentInput = {
    where: StudentSubscriptionWhereUniqueInput
    create: XOR<StudentSubscriptionCreateWithoutStudentInput, StudentSubscriptionUncheckedCreateWithoutStudentInput>
  }

  export type StudentSubscriptionCreateManyStudentInputEnvelope = {
    data: StudentSubscriptionCreateManyStudentInput | StudentSubscriptionCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type StudentLicenseCreateWithoutStudentInput = {
    id?: string
    licenseNumber: string
    validUntil: Date | string
    isActive?: boolean
    federation: FederationCreateNestedOneWithoutLicensesInput
  }

  export type StudentLicenseUncheckedCreateWithoutStudentInput = {
    id?: string
    federationId: string
    licenseNumber: string
    validUntil: Date | string
    isActive?: boolean
  }

  export type StudentLicenseCreateOrConnectWithoutStudentInput = {
    where: StudentLicenseWhereUniqueInput
    create: XOR<StudentLicenseCreateWithoutStudentInput, StudentLicenseUncheckedCreateWithoutStudentInput>
  }

  export type StudentLicenseCreateManyStudentInputEnvelope = {
    data: StudentLicenseCreateManyStudentInput | StudentLicenseCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutStudentProfileInput = {
    update: XOR<UserUpdateWithoutStudentProfileInput, UserUncheckedUpdateWithoutStudentProfileInput>
    create: XOR<UserCreateWithoutStudentProfileInput, UserUncheckedCreateWithoutStudentProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStudentProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStudentProfileInput, UserUncheckedUpdateWithoutStudentProfileInput>
  }

  export type UserUpdateWithoutStudentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guardianProfile?: GuardianUpdateOneWithoutUserNestedInput
    reviewedUpdates?: ProfileUpdateRequestUpdateManyWithoutReviewerNestedInput
    proposedPromotions?: PromotionRequestUpdateManyWithoutProposedByNestedInput
    approvedPromotions?: PromotionRequestUpdateManyWithoutApprovedByNestedInput
  }

  export type UserUncheckedUpdateWithoutStudentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guardianProfile?: GuardianUncheckedUpdateOneWithoutUserNestedInput
    reviewedUpdates?: ProfileUpdateRequestUncheckedUpdateManyWithoutReviewerNestedInput
    proposedPromotions?: PromotionRequestUncheckedUpdateManyWithoutProposedByNestedInput
    approvedPromotions?: PromotionRequestUncheckedUpdateManyWithoutApprovedByNestedInput
  }

  export type StudentGuardianUpsertWithWhereUniqueWithoutStudentInput = {
    where: StudentGuardianWhereUniqueInput
    update: XOR<StudentGuardianUpdateWithoutStudentInput, StudentGuardianUncheckedUpdateWithoutStudentInput>
    create: XOR<StudentGuardianCreateWithoutStudentInput, StudentGuardianUncheckedCreateWithoutStudentInput>
  }

  export type StudentGuardianUpdateWithWhereUniqueWithoutStudentInput = {
    where: StudentGuardianWhereUniqueInput
    data: XOR<StudentGuardianUpdateWithoutStudentInput, StudentGuardianUncheckedUpdateWithoutStudentInput>
  }

  export type StudentGuardianUpdateManyWithWhereWithoutStudentInput = {
    where: StudentGuardianScalarWhereInput
    data: XOR<StudentGuardianUpdateManyMutationInput, StudentGuardianUncheckedUpdateManyWithoutStudentInput>
  }

  export type StudentGuardianScalarWhereInput = {
    AND?: StudentGuardianScalarWhereInput | StudentGuardianScalarWhereInput[]
    OR?: StudentGuardianScalarWhereInput[]
    NOT?: StudentGuardianScalarWhereInput | StudentGuardianScalarWhereInput[]
    studentProfileId?: StringFilter<"StudentGuardian"> | string
    guardianId?: StringFilter<"StudentGuardian"> | string
    relationship?: StringNullableFilter<"StudentGuardian"> | string | null
  }

  export type StudentRankUpsertWithWhereUniqueWithoutStudentInput = {
    where: StudentRankWhereUniqueInput
    update: XOR<StudentRankUpdateWithoutStudentInput, StudentRankUncheckedUpdateWithoutStudentInput>
    create: XOR<StudentRankCreateWithoutStudentInput, StudentRankUncheckedCreateWithoutStudentInput>
  }

  export type StudentRankUpdateWithWhereUniqueWithoutStudentInput = {
    where: StudentRankWhereUniqueInput
    data: XOR<StudentRankUpdateWithoutStudentInput, StudentRankUncheckedUpdateWithoutStudentInput>
  }

  export type StudentRankUpdateManyWithWhereWithoutStudentInput = {
    where: StudentRankScalarWhereInput
    data: XOR<StudentRankUpdateManyMutationInput, StudentRankUncheckedUpdateManyWithoutStudentInput>
  }

  export type StudentRankScalarWhereInput = {
    AND?: StudentRankScalarWhereInput | StudentRankScalarWhereInput[]
    OR?: StudentRankScalarWhereInput[]
    NOT?: StudentRankScalarWhereInput | StudentRankScalarWhereInput[]
    id?: StringFilter<"StudentRank"> | string
    studentProfileId?: StringFilter<"StudentRank"> | string
    beltRankId?: StringFilter<"StudentRank"> | string
    currentStripes?: IntFilter<"StudentRank"> | number
    accumulatedHours?: IntFilter<"StudentRank"> | number
    promotedAt?: DateTimeFilter<"StudentRank"> | Date | string
    lastStripeAt?: DateTimeFilter<"StudentRank"> | Date | string
  }

  export type AttendanceUpsertWithWhereUniqueWithoutStudentInput = {
    where: AttendanceWhereUniqueInput
    update: XOR<AttendanceUpdateWithoutStudentInput, AttendanceUncheckedUpdateWithoutStudentInput>
    create: XOR<AttendanceCreateWithoutStudentInput, AttendanceUncheckedCreateWithoutStudentInput>
  }

  export type AttendanceUpdateWithWhereUniqueWithoutStudentInput = {
    where: AttendanceWhereUniqueInput
    data: XOR<AttendanceUpdateWithoutStudentInput, AttendanceUncheckedUpdateWithoutStudentInput>
  }

  export type AttendanceUpdateManyWithWhereWithoutStudentInput = {
    where: AttendanceScalarWhereInput
    data: XOR<AttendanceUpdateManyMutationInput, AttendanceUncheckedUpdateManyWithoutStudentInput>
  }

  export type AttendanceScalarWhereInput = {
    AND?: AttendanceScalarWhereInput | AttendanceScalarWhereInput[]
    OR?: AttendanceScalarWhereInput[]
    NOT?: AttendanceScalarWhereInput | AttendanceScalarWhereInput[]
    id?: StringFilter<"Attendance"> | string
    studentProfileId?: StringFilter<"Attendance"> | string
    date?: DateTimeFilter<"Attendance"> | Date | string
    countedForRank?: BoolFilter<"Attendance"> | boolean
  }

  export type ProfileUpdateRequestUpsertWithWhereUniqueWithoutStudentProfileInput = {
    where: ProfileUpdateRequestWhereUniqueInput
    update: XOR<ProfileUpdateRequestUpdateWithoutStudentProfileInput, ProfileUpdateRequestUncheckedUpdateWithoutStudentProfileInput>
    create: XOR<ProfileUpdateRequestCreateWithoutStudentProfileInput, ProfileUpdateRequestUncheckedCreateWithoutStudentProfileInput>
  }

  export type ProfileUpdateRequestUpdateWithWhereUniqueWithoutStudentProfileInput = {
    where: ProfileUpdateRequestWhereUniqueInput
    data: XOR<ProfileUpdateRequestUpdateWithoutStudentProfileInput, ProfileUpdateRequestUncheckedUpdateWithoutStudentProfileInput>
  }

  export type ProfileUpdateRequestUpdateManyWithWhereWithoutStudentProfileInput = {
    where: ProfileUpdateRequestScalarWhereInput
    data: XOR<ProfileUpdateRequestUpdateManyMutationInput, ProfileUpdateRequestUncheckedUpdateManyWithoutStudentProfileInput>
  }

  export type PromotionRequestUpsertWithWhereUniqueWithoutStudentProfileInput = {
    where: PromotionRequestWhereUniqueInput
    update: XOR<PromotionRequestUpdateWithoutStudentProfileInput, PromotionRequestUncheckedUpdateWithoutStudentProfileInput>
    create: XOR<PromotionRequestCreateWithoutStudentProfileInput, PromotionRequestUncheckedCreateWithoutStudentProfileInput>
  }

  export type PromotionRequestUpdateWithWhereUniqueWithoutStudentProfileInput = {
    where: PromotionRequestWhereUniqueInput
    data: XOR<PromotionRequestUpdateWithoutStudentProfileInput, PromotionRequestUncheckedUpdateWithoutStudentProfileInput>
  }

  export type PromotionRequestUpdateManyWithWhereWithoutStudentProfileInput = {
    where: PromotionRequestScalarWhereInput
    data: XOR<PromotionRequestUpdateManyMutationInput, PromotionRequestUncheckedUpdateManyWithoutStudentProfileInput>
  }

  export type StudentSubscriptionUpsertWithWhereUniqueWithoutStudentInput = {
    where: StudentSubscriptionWhereUniqueInput
    update: XOR<StudentSubscriptionUpdateWithoutStudentInput, StudentSubscriptionUncheckedUpdateWithoutStudentInput>
    create: XOR<StudentSubscriptionCreateWithoutStudentInput, StudentSubscriptionUncheckedCreateWithoutStudentInput>
  }

  export type StudentSubscriptionUpdateWithWhereUniqueWithoutStudentInput = {
    where: StudentSubscriptionWhereUniqueInput
    data: XOR<StudentSubscriptionUpdateWithoutStudentInput, StudentSubscriptionUncheckedUpdateWithoutStudentInput>
  }

  export type StudentSubscriptionUpdateManyWithWhereWithoutStudentInput = {
    where: StudentSubscriptionScalarWhereInput
    data: XOR<StudentSubscriptionUpdateManyMutationInput, StudentSubscriptionUncheckedUpdateManyWithoutStudentInput>
  }

  export type StudentSubscriptionScalarWhereInput = {
    AND?: StudentSubscriptionScalarWhereInput | StudentSubscriptionScalarWhereInput[]
    OR?: StudentSubscriptionScalarWhereInput[]
    NOT?: StudentSubscriptionScalarWhereInput | StudentSubscriptionScalarWhereInput[]
    id?: StringFilter<"StudentSubscription"> | string
    studentProfileId?: StringFilter<"StudentSubscription"> | string
    feePlanId?: StringFilter<"StudentSubscription"> | string
    isActive?: BoolFilter<"StudentSubscription"> | boolean
    mandateReference?: StringNullableFilter<"StudentSubscription"> | string | null
  }

  export type StudentLicenseUpsertWithWhereUniqueWithoutStudentInput = {
    where: StudentLicenseWhereUniqueInput
    update: XOR<StudentLicenseUpdateWithoutStudentInput, StudentLicenseUncheckedUpdateWithoutStudentInput>
    create: XOR<StudentLicenseCreateWithoutStudentInput, StudentLicenseUncheckedCreateWithoutStudentInput>
  }

  export type StudentLicenseUpdateWithWhereUniqueWithoutStudentInput = {
    where: StudentLicenseWhereUniqueInput
    data: XOR<StudentLicenseUpdateWithoutStudentInput, StudentLicenseUncheckedUpdateWithoutStudentInput>
  }

  export type StudentLicenseUpdateManyWithWhereWithoutStudentInput = {
    where: StudentLicenseScalarWhereInput
    data: XOR<StudentLicenseUpdateManyMutationInput, StudentLicenseUncheckedUpdateManyWithoutStudentInput>
  }

  export type StudentLicenseScalarWhereInput = {
    AND?: StudentLicenseScalarWhereInput | StudentLicenseScalarWhereInput[]
    OR?: StudentLicenseScalarWhereInput[]
    NOT?: StudentLicenseScalarWhereInput | StudentLicenseScalarWhereInput[]
    id?: StringFilter<"StudentLicense"> | string
    studentProfileId?: StringFilter<"StudentLicense"> | string
    federationId?: StringFilter<"StudentLicense"> | string
    licenseNumber?: StringFilter<"StudentLicense"> | string
    validUntil?: DateTimeFilter<"StudentLicense"> | Date | string
    isActive?: BoolFilter<"StudentLicense"> | boolean
  }

  export type UserCreateWithoutGuardianProfileInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    reviewedUpdates?: ProfileUpdateRequestCreateNestedManyWithoutReviewerInput
    proposedPromotions?: PromotionRequestCreateNestedManyWithoutProposedByInput
    approvedPromotions?: PromotionRequestCreateNestedManyWithoutApprovedByInput
  }

  export type UserUncheckedCreateWithoutGuardianProfileInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    reviewedUpdates?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutReviewerInput
    proposedPromotions?: PromotionRequestUncheckedCreateNestedManyWithoutProposedByInput
    approvedPromotions?: PromotionRequestUncheckedCreateNestedManyWithoutApprovedByInput
  }

  export type UserCreateOrConnectWithoutGuardianProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGuardianProfileInput, UserUncheckedCreateWithoutGuardianProfileInput>
  }

  export type StudentGuardianCreateWithoutGuardianInput = {
    relationship?: string | null
    student: StudentProfileCreateNestedOneWithoutGuardiansInput
  }

  export type StudentGuardianUncheckedCreateWithoutGuardianInput = {
    studentProfileId: string
    relationship?: string | null
  }

  export type StudentGuardianCreateOrConnectWithoutGuardianInput = {
    where: StudentGuardianWhereUniqueInput
    create: XOR<StudentGuardianCreateWithoutGuardianInput, StudentGuardianUncheckedCreateWithoutGuardianInput>
  }

  export type StudentGuardianCreateManyGuardianInputEnvelope = {
    data: StudentGuardianCreateManyGuardianInput | StudentGuardianCreateManyGuardianInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutGuardianProfileInput = {
    update: XOR<UserUpdateWithoutGuardianProfileInput, UserUncheckedUpdateWithoutGuardianProfileInput>
    create: XOR<UserCreateWithoutGuardianProfileInput, UserUncheckedCreateWithoutGuardianProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGuardianProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGuardianProfileInput, UserUncheckedUpdateWithoutGuardianProfileInput>
  }

  export type UserUpdateWithoutGuardianProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    reviewedUpdates?: ProfileUpdateRequestUpdateManyWithoutReviewerNestedInput
    proposedPromotions?: PromotionRequestUpdateManyWithoutProposedByNestedInput
    approvedPromotions?: PromotionRequestUpdateManyWithoutApprovedByNestedInput
  }

  export type UserUncheckedUpdateWithoutGuardianProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    reviewedUpdates?: ProfileUpdateRequestUncheckedUpdateManyWithoutReviewerNestedInput
    proposedPromotions?: PromotionRequestUncheckedUpdateManyWithoutProposedByNestedInput
    approvedPromotions?: PromotionRequestUncheckedUpdateManyWithoutApprovedByNestedInput
  }

  export type StudentGuardianUpsertWithWhereUniqueWithoutGuardianInput = {
    where: StudentGuardianWhereUniqueInput
    update: XOR<StudentGuardianUpdateWithoutGuardianInput, StudentGuardianUncheckedUpdateWithoutGuardianInput>
    create: XOR<StudentGuardianCreateWithoutGuardianInput, StudentGuardianUncheckedCreateWithoutGuardianInput>
  }

  export type StudentGuardianUpdateWithWhereUniqueWithoutGuardianInput = {
    where: StudentGuardianWhereUniqueInput
    data: XOR<StudentGuardianUpdateWithoutGuardianInput, StudentGuardianUncheckedUpdateWithoutGuardianInput>
  }

  export type StudentGuardianUpdateManyWithWhereWithoutGuardianInput = {
    where: StudentGuardianScalarWhereInput
    data: XOR<StudentGuardianUpdateManyMutationInput, StudentGuardianUncheckedUpdateManyWithoutGuardianInput>
  }

  export type StudentProfileCreateWithoutGuardiansInput = {
    id?: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentProfileInput
    ranks?: StudentRankCreateNestedManyWithoutStudentInput
    attendances?: AttendanceCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileUncheckedCreateWithoutGuardiansInput = {
    id?: string
    userId: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    ranks?: StudentRankUncheckedCreateNestedManyWithoutStudentInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionUncheckedCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileCreateOrConnectWithoutGuardiansInput = {
    where: StudentProfileWhereUniqueInput
    create: XOR<StudentProfileCreateWithoutGuardiansInput, StudentProfileUncheckedCreateWithoutGuardiansInput>
  }

  export type GuardianCreateWithoutStudentsInput = {
    id?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutGuardianProfileInput
  }

  export type GuardianUncheckedCreateWithoutStudentsInput = {
    id?: string
    userId: string
    createdAt?: Date | string
  }

  export type GuardianCreateOrConnectWithoutStudentsInput = {
    where: GuardianWhereUniqueInput
    create: XOR<GuardianCreateWithoutStudentsInput, GuardianUncheckedCreateWithoutStudentsInput>
  }

  export type StudentProfileUpsertWithoutGuardiansInput = {
    update: XOR<StudentProfileUpdateWithoutGuardiansInput, StudentProfileUncheckedUpdateWithoutGuardiansInput>
    create: XOR<StudentProfileCreateWithoutGuardiansInput, StudentProfileUncheckedCreateWithoutGuardiansInput>
    where?: StudentProfileWhereInput
  }

  export type StudentProfileUpdateToOneWithWhereWithoutGuardiansInput = {
    where?: StudentProfileWhereInput
    data: XOR<StudentProfileUpdateWithoutGuardiansInput, StudentProfileUncheckedUpdateWithoutGuardiansInput>
  }

  export type StudentProfileUpdateWithoutGuardiansInput = {
    id?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentProfileNestedInput
    ranks?: StudentRankUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileUncheckedUpdateWithoutGuardiansInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ranks?: StudentRankUncheckedUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUncheckedUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type GuardianUpsertWithoutStudentsInput = {
    update: XOR<GuardianUpdateWithoutStudentsInput, GuardianUncheckedUpdateWithoutStudentsInput>
    create: XOR<GuardianCreateWithoutStudentsInput, GuardianUncheckedCreateWithoutStudentsInput>
    where?: GuardianWhereInput
  }

  export type GuardianUpdateToOneWithWhereWithoutStudentsInput = {
    where?: GuardianWhereInput
    data: XOR<GuardianUpdateWithoutStudentsInput, GuardianUncheckedUpdateWithoutStudentsInput>
  }

  export type GuardianUpdateWithoutStudentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGuardianProfileNestedInput
  }

  export type GuardianUncheckedUpdateWithoutStudentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DisciplineProgramCreateWithoutDisciplineInput = {
    id?: string
    name: string
    minAge?: number
    maxAge?: number
    beltRanks?: BeltRankCreateNestedManyWithoutProgramInput
  }

  export type DisciplineProgramUncheckedCreateWithoutDisciplineInput = {
    id?: string
    name: string
    minAge?: number
    maxAge?: number
    beltRanks?: BeltRankUncheckedCreateNestedManyWithoutProgramInput
  }

  export type DisciplineProgramCreateOrConnectWithoutDisciplineInput = {
    where: DisciplineProgramWhereUniqueInput
    create: XOR<DisciplineProgramCreateWithoutDisciplineInput, DisciplineProgramUncheckedCreateWithoutDisciplineInput>
  }

  export type DisciplineProgramCreateManyDisciplineInputEnvelope = {
    data: DisciplineProgramCreateManyDisciplineInput | DisciplineProgramCreateManyDisciplineInput[]
    skipDuplicates?: boolean
  }

  export type DisciplineProgramUpsertWithWhereUniqueWithoutDisciplineInput = {
    where: DisciplineProgramWhereUniqueInput
    update: XOR<DisciplineProgramUpdateWithoutDisciplineInput, DisciplineProgramUncheckedUpdateWithoutDisciplineInput>
    create: XOR<DisciplineProgramCreateWithoutDisciplineInput, DisciplineProgramUncheckedCreateWithoutDisciplineInput>
  }

  export type DisciplineProgramUpdateWithWhereUniqueWithoutDisciplineInput = {
    where: DisciplineProgramWhereUniqueInput
    data: XOR<DisciplineProgramUpdateWithoutDisciplineInput, DisciplineProgramUncheckedUpdateWithoutDisciplineInput>
  }

  export type DisciplineProgramUpdateManyWithWhereWithoutDisciplineInput = {
    where: DisciplineProgramScalarWhereInput
    data: XOR<DisciplineProgramUpdateManyMutationInput, DisciplineProgramUncheckedUpdateManyWithoutDisciplineInput>
  }

  export type DisciplineProgramScalarWhereInput = {
    AND?: DisciplineProgramScalarWhereInput | DisciplineProgramScalarWhereInput[]
    OR?: DisciplineProgramScalarWhereInput[]
    NOT?: DisciplineProgramScalarWhereInput | DisciplineProgramScalarWhereInput[]
    id?: StringFilter<"DisciplineProgram"> | string
    disciplineId?: StringFilter<"DisciplineProgram"> | string
    name?: StringFilter<"DisciplineProgram"> | string
    minAge?: IntFilter<"DisciplineProgram"> | number
    maxAge?: IntFilter<"DisciplineProgram"> | number
  }

  export type DisciplineCreateWithoutProgramsInput = {
    id?: string
    name: string
    description?: string | null
  }

  export type DisciplineUncheckedCreateWithoutProgramsInput = {
    id?: string
    name: string
    description?: string | null
  }

  export type DisciplineCreateOrConnectWithoutProgramsInput = {
    where: DisciplineWhereUniqueInput
    create: XOR<DisciplineCreateWithoutProgramsInput, DisciplineUncheckedCreateWithoutProgramsInput>
  }

  export type BeltRankCreateWithoutProgramInput = {
    id?: string
    name: string
    order: number
    maxStripes?: number
    minMonthsRequired?: number
    minHoursRequired?: number
    studentRanks?: StudentRankCreateNestedManyWithoutBeltRankInput
  }

  export type BeltRankUncheckedCreateWithoutProgramInput = {
    id?: string
    name: string
    order: number
    maxStripes?: number
    minMonthsRequired?: number
    minHoursRequired?: number
    studentRanks?: StudentRankUncheckedCreateNestedManyWithoutBeltRankInput
  }

  export type BeltRankCreateOrConnectWithoutProgramInput = {
    where: BeltRankWhereUniqueInput
    create: XOR<BeltRankCreateWithoutProgramInput, BeltRankUncheckedCreateWithoutProgramInput>
  }

  export type BeltRankCreateManyProgramInputEnvelope = {
    data: BeltRankCreateManyProgramInput | BeltRankCreateManyProgramInput[]
    skipDuplicates?: boolean
  }

  export type DisciplineUpsertWithoutProgramsInput = {
    update: XOR<DisciplineUpdateWithoutProgramsInput, DisciplineUncheckedUpdateWithoutProgramsInput>
    create: XOR<DisciplineCreateWithoutProgramsInput, DisciplineUncheckedCreateWithoutProgramsInput>
    where?: DisciplineWhereInput
  }

  export type DisciplineUpdateToOneWithWhereWithoutProgramsInput = {
    where?: DisciplineWhereInput
    data: XOR<DisciplineUpdateWithoutProgramsInput, DisciplineUncheckedUpdateWithoutProgramsInput>
  }

  export type DisciplineUpdateWithoutProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DisciplineUncheckedUpdateWithoutProgramsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BeltRankUpsertWithWhereUniqueWithoutProgramInput = {
    where: BeltRankWhereUniqueInput
    update: XOR<BeltRankUpdateWithoutProgramInput, BeltRankUncheckedUpdateWithoutProgramInput>
    create: XOR<BeltRankCreateWithoutProgramInput, BeltRankUncheckedCreateWithoutProgramInput>
  }

  export type BeltRankUpdateWithWhereUniqueWithoutProgramInput = {
    where: BeltRankWhereUniqueInput
    data: XOR<BeltRankUpdateWithoutProgramInput, BeltRankUncheckedUpdateWithoutProgramInput>
  }

  export type BeltRankUpdateManyWithWhereWithoutProgramInput = {
    where: BeltRankScalarWhereInput
    data: XOR<BeltRankUpdateManyMutationInput, BeltRankUncheckedUpdateManyWithoutProgramInput>
  }

  export type BeltRankScalarWhereInput = {
    AND?: BeltRankScalarWhereInput | BeltRankScalarWhereInput[]
    OR?: BeltRankScalarWhereInput[]
    NOT?: BeltRankScalarWhereInput | BeltRankScalarWhereInput[]
    id?: StringFilter<"BeltRank"> | string
    disciplineProgramId?: StringFilter<"BeltRank"> | string
    name?: StringFilter<"BeltRank"> | string
    order?: IntFilter<"BeltRank"> | number
    maxStripes?: IntFilter<"BeltRank"> | number
    minMonthsRequired?: IntFilter<"BeltRank"> | number
    minHoursRequired?: IntFilter<"BeltRank"> | number
  }

  export type DisciplineProgramCreateWithoutBeltRanksInput = {
    id?: string
    name: string
    minAge?: number
    maxAge?: number
    discipline: DisciplineCreateNestedOneWithoutProgramsInput
  }

  export type DisciplineProgramUncheckedCreateWithoutBeltRanksInput = {
    id?: string
    disciplineId: string
    name: string
    minAge?: number
    maxAge?: number
  }

  export type DisciplineProgramCreateOrConnectWithoutBeltRanksInput = {
    where: DisciplineProgramWhereUniqueInput
    create: XOR<DisciplineProgramCreateWithoutBeltRanksInput, DisciplineProgramUncheckedCreateWithoutBeltRanksInput>
  }

  export type StudentRankCreateWithoutBeltRankInput = {
    id?: string
    currentStripes?: number
    accumulatedHours?: number
    promotedAt?: Date | string
    lastStripeAt?: Date | string
    student: StudentProfileCreateNestedOneWithoutRanksInput
  }

  export type StudentRankUncheckedCreateWithoutBeltRankInput = {
    id?: string
    studentProfileId: string
    currentStripes?: number
    accumulatedHours?: number
    promotedAt?: Date | string
    lastStripeAt?: Date | string
  }

  export type StudentRankCreateOrConnectWithoutBeltRankInput = {
    where: StudentRankWhereUniqueInput
    create: XOR<StudentRankCreateWithoutBeltRankInput, StudentRankUncheckedCreateWithoutBeltRankInput>
  }

  export type StudentRankCreateManyBeltRankInputEnvelope = {
    data: StudentRankCreateManyBeltRankInput | StudentRankCreateManyBeltRankInput[]
    skipDuplicates?: boolean
  }

  export type DisciplineProgramUpsertWithoutBeltRanksInput = {
    update: XOR<DisciplineProgramUpdateWithoutBeltRanksInput, DisciplineProgramUncheckedUpdateWithoutBeltRanksInput>
    create: XOR<DisciplineProgramCreateWithoutBeltRanksInput, DisciplineProgramUncheckedCreateWithoutBeltRanksInput>
    where?: DisciplineProgramWhereInput
  }

  export type DisciplineProgramUpdateToOneWithWhereWithoutBeltRanksInput = {
    where?: DisciplineProgramWhereInput
    data: XOR<DisciplineProgramUpdateWithoutBeltRanksInput, DisciplineProgramUncheckedUpdateWithoutBeltRanksInput>
  }

  export type DisciplineProgramUpdateWithoutBeltRanksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    minAge?: IntFieldUpdateOperationsInput | number
    maxAge?: IntFieldUpdateOperationsInput | number
    discipline?: DisciplineUpdateOneRequiredWithoutProgramsNestedInput
  }

  export type DisciplineProgramUncheckedUpdateWithoutBeltRanksInput = {
    id?: StringFieldUpdateOperationsInput | string
    disciplineId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    minAge?: IntFieldUpdateOperationsInput | number
    maxAge?: IntFieldUpdateOperationsInput | number
  }

  export type StudentRankUpsertWithWhereUniqueWithoutBeltRankInput = {
    where: StudentRankWhereUniqueInput
    update: XOR<StudentRankUpdateWithoutBeltRankInput, StudentRankUncheckedUpdateWithoutBeltRankInput>
    create: XOR<StudentRankCreateWithoutBeltRankInput, StudentRankUncheckedCreateWithoutBeltRankInput>
  }

  export type StudentRankUpdateWithWhereUniqueWithoutBeltRankInput = {
    where: StudentRankWhereUniqueInput
    data: XOR<StudentRankUpdateWithoutBeltRankInput, StudentRankUncheckedUpdateWithoutBeltRankInput>
  }

  export type StudentRankUpdateManyWithWhereWithoutBeltRankInput = {
    where: StudentRankScalarWhereInput
    data: XOR<StudentRankUpdateManyMutationInput, StudentRankUncheckedUpdateManyWithoutBeltRankInput>
  }

  export type StudentProfileCreateWithoutRanksInput = {
    id?: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentProfileInput
    guardians?: StudentGuardianCreateNestedManyWithoutStudentInput
    attendances?: AttendanceCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileUncheckedCreateWithoutRanksInput = {
    id?: string
    userId: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    guardians?: StudentGuardianUncheckedCreateNestedManyWithoutStudentInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionUncheckedCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileCreateOrConnectWithoutRanksInput = {
    where: StudentProfileWhereUniqueInput
    create: XOR<StudentProfileCreateWithoutRanksInput, StudentProfileUncheckedCreateWithoutRanksInput>
  }

  export type BeltRankCreateWithoutStudentRanksInput = {
    id?: string
    name: string
    order: number
    maxStripes?: number
    minMonthsRequired?: number
    minHoursRequired?: number
    program: DisciplineProgramCreateNestedOneWithoutBeltRanksInput
  }

  export type BeltRankUncheckedCreateWithoutStudentRanksInput = {
    id?: string
    disciplineProgramId: string
    name: string
    order: number
    maxStripes?: number
    minMonthsRequired?: number
    minHoursRequired?: number
  }

  export type BeltRankCreateOrConnectWithoutStudentRanksInput = {
    where: BeltRankWhereUniqueInput
    create: XOR<BeltRankCreateWithoutStudentRanksInput, BeltRankUncheckedCreateWithoutStudentRanksInput>
  }

  export type StudentProfileUpsertWithoutRanksInput = {
    update: XOR<StudentProfileUpdateWithoutRanksInput, StudentProfileUncheckedUpdateWithoutRanksInput>
    create: XOR<StudentProfileCreateWithoutRanksInput, StudentProfileUncheckedCreateWithoutRanksInput>
    where?: StudentProfileWhereInput
  }

  export type StudentProfileUpdateToOneWithWhereWithoutRanksInput = {
    where?: StudentProfileWhereInput
    data: XOR<StudentProfileUpdateWithoutRanksInput, StudentProfileUncheckedUpdateWithoutRanksInput>
  }

  export type StudentProfileUpdateWithoutRanksInput = {
    id?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentProfileNestedInput
    guardians?: StudentGuardianUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileUncheckedUpdateWithoutRanksInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guardians?: StudentGuardianUncheckedUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUncheckedUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type BeltRankUpsertWithoutStudentRanksInput = {
    update: XOR<BeltRankUpdateWithoutStudentRanksInput, BeltRankUncheckedUpdateWithoutStudentRanksInput>
    create: XOR<BeltRankCreateWithoutStudentRanksInput, BeltRankUncheckedCreateWithoutStudentRanksInput>
    where?: BeltRankWhereInput
  }

  export type BeltRankUpdateToOneWithWhereWithoutStudentRanksInput = {
    where?: BeltRankWhereInput
    data: XOR<BeltRankUpdateWithoutStudentRanksInput, BeltRankUncheckedUpdateWithoutStudentRanksInput>
  }

  export type BeltRankUpdateWithoutStudentRanksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    maxStripes?: IntFieldUpdateOperationsInput | number
    minMonthsRequired?: IntFieldUpdateOperationsInput | number
    minHoursRequired?: IntFieldUpdateOperationsInput | number
    program?: DisciplineProgramUpdateOneRequiredWithoutBeltRanksNestedInput
  }

  export type BeltRankUncheckedUpdateWithoutStudentRanksInput = {
    id?: StringFieldUpdateOperationsInput | string
    disciplineProgramId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    maxStripes?: IntFieldUpdateOperationsInput | number
    minMonthsRequired?: IntFieldUpdateOperationsInput | number
    minHoursRequired?: IntFieldUpdateOperationsInput | number
  }

  export type StudentProfileCreateWithoutAttendancesInput = {
    id?: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentProfileInput
    guardians?: StudentGuardianCreateNestedManyWithoutStudentInput
    ranks?: StudentRankCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileUncheckedCreateWithoutAttendancesInput = {
    id?: string
    userId: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    guardians?: StudentGuardianUncheckedCreateNestedManyWithoutStudentInput
    ranks?: StudentRankUncheckedCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionUncheckedCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileCreateOrConnectWithoutAttendancesInput = {
    where: StudentProfileWhereUniqueInput
    create: XOR<StudentProfileCreateWithoutAttendancesInput, StudentProfileUncheckedCreateWithoutAttendancesInput>
  }

  export type StudentProfileUpsertWithoutAttendancesInput = {
    update: XOR<StudentProfileUpdateWithoutAttendancesInput, StudentProfileUncheckedUpdateWithoutAttendancesInput>
    create: XOR<StudentProfileCreateWithoutAttendancesInput, StudentProfileUncheckedCreateWithoutAttendancesInput>
    where?: StudentProfileWhereInput
  }

  export type StudentProfileUpdateToOneWithWhereWithoutAttendancesInput = {
    where?: StudentProfileWhereInput
    data: XOR<StudentProfileUpdateWithoutAttendancesInput, StudentProfileUncheckedUpdateWithoutAttendancesInput>
  }

  export type StudentProfileUpdateWithoutAttendancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentProfileNestedInput
    guardians?: StudentGuardianUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileUncheckedUpdateWithoutAttendancesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guardians?: StudentGuardianUncheckedUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUncheckedUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUncheckedUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileCreateWithoutUpdateRequestsInput = {
    id?: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentProfileInput
    guardians?: StudentGuardianCreateNestedManyWithoutStudentInput
    ranks?: StudentRankCreateNestedManyWithoutStudentInput
    attendances?: AttendanceCreateNestedManyWithoutStudentInput
    promotionRequests?: PromotionRequestCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileUncheckedCreateWithoutUpdateRequestsInput = {
    id?: string
    userId: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    guardians?: StudentGuardianUncheckedCreateNestedManyWithoutStudentInput
    ranks?: StudentRankUncheckedCreateNestedManyWithoutStudentInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutStudentInput
    promotionRequests?: PromotionRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionUncheckedCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileCreateOrConnectWithoutUpdateRequestsInput = {
    where: StudentProfileWhereUniqueInput
    create: XOR<StudentProfileCreateWithoutUpdateRequestsInput, StudentProfileUncheckedCreateWithoutUpdateRequestsInput>
  }

  export type UserCreateWithoutReviewedUpdatesInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    guardianProfile?: GuardianCreateNestedOneWithoutUserInput
    proposedPromotions?: PromotionRequestCreateNestedManyWithoutProposedByInput
    approvedPromotions?: PromotionRequestCreateNestedManyWithoutApprovedByInput
  }

  export type UserUncheckedCreateWithoutReviewedUpdatesInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    guardianProfile?: GuardianUncheckedCreateNestedOneWithoutUserInput
    proposedPromotions?: PromotionRequestUncheckedCreateNestedManyWithoutProposedByInput
    approvedPromotions?: PromotionRequestUncheckedCreateNestedManyWithoutApprovedByInput
  }

  export type UserCreateOrConnectWithoutReviewedUpdatesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReviewedUpdatesInput, UserUncheckedCreateWithoutReviewedUpdatesInput>
  }

  export type StudentProfileUpsertWithoutUpdateRequestsInput = {
    update: XOR<StudentProfileUpdateWithoutUpdateRequestsInput, StudentProfileUncheckedUpdateWithoutUpdateRequestsInput>
    create: XOR<StudentProfileCreateWithoutUpdateRequestsInput, StudentProfileUncheckedCreateWithoutUpdateRequestsInput>
    where?: StudentProfileWhereInput
  }

  export type StudentProfileUpdateToOneWithWhereWithoutUpdateRequestsInput = {
    where?: StudentProfileWhereInput
    data: XOR<StudentProfileUpdateWithoutUpdateRequestsInput, StudentProfileUncheckedUpdateWithoutUpdateRequestsInput>
  }

  export type StudentProfileUpdateWithoutUpdateRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentProfileNestedInput
    guardians?: StudentGuardianUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUpdateManyWithoutStudentNestedInput
    promotionRequests?: PromotionRequestUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileUncheckedUpdateWithoutUpdateRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guardians?: StudentGuardianUncheckedUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUncheckedUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutStudentNestedInput
    promotionRequests?: PromotionRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUncheckedUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type UserUpsertWithoutReviewedUpdatesInput = {
    update: XOR<UserUpdateWithoutReviewedUpdatesInput, UserUncheckedUpdateWithoutReviewedUpdatesInput>
    create: XOR<UserCreateWithoutReviewedUpdatesInput, UserUncheckedCreateWithoutReviewedUpdatesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReviewedUpdatesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReviewedUpdatesInput, UserUncheckedUpdateWithoutReviewedUpdatesInput>
  }

  export type UserUpdateWithoutReviewedUpdatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    guardianProfile?: GuardianUpdateOneWithoutUserNestedInput
    proposedPromotions?: PromotionRequestUpdateManyWithoutProposedByNestedInput
    approvedPromotions?: PromotionRequestUpdateManyWithoutApprovedByNestedInput
  }

  export type UserUncheckedUpdateWithoutReviewedUpdatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    guardianProfile?: GuardianUncheckedUpdateOneWithoutUserNestedInput
    proposedPromotions?: PromotionRequestUncheckedUpdateManyWithoutProposedByNestedInput
    approvedPromotions?: PromotionRequestUncheckedUpdateManyWithoutApprovedByNestedInput
  }

  export type StudentProfileCreateWithoutPromotionRequestsInput = {
    id?: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentProfileInput
    guardians?: StudentGuardianCreateNestedManyWithoutStudentInput
    ranks?: StudentRankCreateNestedManyWithoutStudentInput
    attendances?: AttendanceCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileUncheckedCreateWithoutPromotionRequestsInput = {
    id?: string
    userId: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    guardians?: StudentGuardianUncheckedCreateNestedManyWithoutStudentInput
    ranks?: StudentRankUncheckedCreateNestedManyWithoutStudentInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionUncheckedCreateNestedManyWithoutStudentInput
    licenses?: StudentLicenseUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileCreateOrConnectWithoutPromotionRequestsInput = {
    where: StudentProfileWhereUniqueInput
    create: XOR<StudentProfileCreateWithoutPromotionRequestsInput, StudentProfileUncheckedCreateWithoutPromotionRequestsInput>
  }

  export type UserCreateWithoutProposedPromotionsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    guardianProfile?: GuardianCreateNestedOneWithoutUserInput
    reviewedUpdates?: ProfileUpdateRequestCreateNestedManyWithoutReviewerInput
    approvedPromotions?: PromotionRequestCreateNestedManyWithoutApprovedByInput
  }

  export type UserUncheckedCreateWithoutProposedPromotionsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    guardianProfile?: GuardianUncheckedCreateNestedOneWithoutUserInput
    reviewedUpdates?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutReviewerInput
    approvedPromotions?: PromotionRequestUncheckedCreateNestedManyWithoutApprovedByInput
  }

  export type UserCreateOrConnectWithoutProposedPromotionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProposedPromotionsInput, UserUncheckedCreateWithoutProposedPromotionsInput>
  }

  export type UserCreateWithoutApprovedPromotionsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileCreateNestedOneWithoutUserInput
    guardianProfile?: GuardianCreateNestedOneWithoutUserInput
    reviewedUpdates?: ProfileUpdateRequestCreateNestedManyWithoutReviewerInput
    proposedPromotions?: PromotionRequestCreateNestedManyWithoutProposedByInput
  }

  export type UserUncheckedCreateWithoutApprovedPromotionsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    studentProfile?: StudentProfileUncheckedCreateNestedOneWithoutUserInput
    guardianProfile?: GuardianUncheckedCreateNestedOneWithoutUserInput
    reviewedUpdates?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutReviewerInput
    proposedPromotions?: PromotionRequestUncheckedCreateNestedManyWithoutProposedByInput
  }

  export type UserCreateOrConnectWithoutApprovedPromotionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutApprovedPromotionsInput, UserUncheckedCreateWithoutApprovedPromotionsInput>
  }

  export type StudentProfileUpsertWithoutPromotionRequestsInput = {
    update: XOR<StudentProfileUpdateWithoutPromotionRequestsInput, StudentProfileUncheckedUpdateWithoutPromotionRequestsInput>
    create: XOR<StudentProfileCreateWithoutPromotionRequestsInput, StudentProfileUncheckedCreateWithoutPromotionRequestsInput>
    where?: StudentProfileWhereInput
  }

  export type StudentProfileUpdateToOneWithWhereWithoutPromotionRequestsInput = {
    where?: StudentProfileWhereInput
    data: XOR<StudentProfileUpdateWithoutPromotionRequestsInput, StudentProfileUncheckedUpdateWithoutPromotionRequestsInput>
  }

  export type StudentProfileUpdateWithoutPromotionRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentProfileNestedInput
    guardians?: StudentGuardianUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileUncheckedUpdateWithoutPromotionRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guardians?: StudentGuardianUncheckedUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUncheckedUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUncheckedUpdateManyWithoutStudentNestedInput
    licenses?: StudentLicenseUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type UserUpsertWithoutProposedPromotionsInput = {
    update: XOR<UserUpdateWithoutProposedPromotionsInput, UserUncheckedUpdateWithoutProposedPromotionsInput>
    create: XOR<UserCreateWithoutProposedPromotionsInput, UserUncheckedCreateWithoutProposedPromotionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProposedPromotionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProposedPromotionsInput, UserUncheckedUpdateWithoutProposedPromotionsInput>
  }

  export type UserUpdateWithoutProposedPromotionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    guardianProfile?: GuardianUpdateOneWithoutUserNestedInput
    reviewedUpdates?: ProfileUpdateRequestUpdateManyWithoutReviewerNestedInput
    approvedPromotions?: PromotionRequestUpdateManyWithoutApprovedByNestedInput
  }

  export type UserUncheckedUpdateWithoutProposedPromotionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    guardianProfile?: GuardianUncheckedUpdateOneWithoutUserNestedInput
    reviewedUpdates?: ProfileUpdateRequestUncheckedUpdateManyWithoutReviewerNestedInput
    approvedPromotions?: PromotionRequestUncheckedUpdateManyWithoutApprovedByNestedInput
  }

  export type UserUpsertWithoutApprovedPromotionsInput = {
    update: XOR<UserUpdateWithoutApprovedPromotionsInput, UserUncheckedUpdateWithoutApprovedPromotionsInput>
    create: XOR<UserCreateWithoutApprovedPromotionsInput, UserUncheckedCreateWithoutApprovedPromotionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutApprovedPromotionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutApprovedPromotionsInput, UserUncheckedUpdateWithoutApprovedPromotionsInput>
  }

  export type UserUpdateWithoutApprovedPromotionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneWithoutUserNestedInput
    guardianProfile?: GuardianUpdateOneWithoutUserNestedInput
    reviewedUpdates?: ProfileUpdateRequestUpdateManyWithoutReviewerNestedInput
    proposedPromotions?: PromotionRequestUpdateManyWithoutProposedByNestedInput
  }

  export type UserUncheckedUpdateWithoutApprovedPromotionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUncheckedUpdateOneWithoutUserNestedInput
    guardianProfile?: GuardianUncheckedUpdateOneWithoutUserNestedInput
    reviewedUpdates?: ProfileUpdateRequestUncheckedUpdateManyWithoutReviewerNestedInput
    proposedPromotions?: PromotionRequestUncheckedUpdateManyWithoutProposedByNestedInput
  }

  export type StudentSubscriptionCreateWithoutFeePlanInput = {
    id?: string
    isActive?: boolean
    mandateReference?: string | null
    student: StudentProfileCreateNestedOneWithoutSubscriptionsInput
  }

  export type StudentSubscriptionUncheckedCreateWithoutFeePlanInput = {
    id?: string
    studentProfileId: string
    isActive?: boolean
    mandateReference?: string | null
  }

  export type StudentSubscriptionCreateOrConnectWithoutFeePlanInput = {
    where: StudentSubscriptionWhereUniqueInput
    create: XOR<StudentSubscriptionCreateWithoutFeePlanInput, StudentSubscriptionUncheckedCreateWithoutFeePlanInput>
  }

  export type StudentSubscriptionCreateManyFeePlanInputEnvelope = {
    data: StudentSubscriptionCreateManyFeePlanInput | StudentSubscriptionCreateManyFeePlanInput[]
    skipDuplicates?: boolean
  }

  export type StudentSubscriptionUpsertWithWhereUniqueWithoutFeePlanInput = {
    where: StudentSubscriptionWhereUniqueInput
    update: XOR<StudentSubscriptionUpdateWithoutFeePlanInput, StudentSubscriptionUncheckedUpdateWithoutFeePlanInput>
    create: XOR<StudentSubscriptionCreateWithoutFeePlanInput, StudentSubscriptionUncheckedCreateWithoutFeePlanInput>
  }

  export type StudentSubscriptionUpdateWithWhereUniqueWithoutFeePlanInput = {
    where: StudentSubscriptionWhereUniqueInput
    data: XOR<StudentSubscriptionUpdateWithoutFeePlanInput, StudentSubscriptionUncheckedUpdateWithoutFeePlanInput>
  }

  export type StudentSubscriptionUpdateManyWithWhereWithoutFeePlanInput = {
    where: StudentSubscriptionScalarWhereInput
    data: XOR<StudentSubscriptionUpdateManyMutationInput, StudentSubscriptionUncheckedUpdateManyWithoutFeePlanInput>
  }

  export type StudentProfileCreateWithoutSubscriptionsInput = {
    id?: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentProfileInput
    guardians?: StudentGuardianCreateNestedManyWithoutStudentInput
    ranks?: StudentRankCreateNestedManyWithoutStudentInput
    attendances?: AttendanceCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestCreateNestedManyWithoutStudentProfileInput
    licenses?: StudentLicenseCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    userId: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    guardians?: StudentGuardianUncheckedCreateNestedManyWithoutStudentInput
    ranks?: StudentRankUncheckedCreateNestedManyWithoutStudentInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    licenses?: StudentLicenseUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileCreateOrConnectWithoutSubscriptionsInput = {
    where: StudentProfileWhereUniqueInput
    create: XOR<StudentProfileCreateWithoutSubscriptionsInput, StudentProfileUncheckedCreateWithoutSubscriptionsInput>
  }

  export type FeePlanCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    monthlyPrice: number
  }

  export type FeePlanUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    monthlyPrice: number
  }

  export type FeePlanCreateOrConnectWithoutSubscriptionsInput = {
    where: FeePlanWhereUniqueInput
    create: XOR<FeePlanCreateWithoutSubscriptionsInput, FeePlanUncheckedCreateWithoutSubscriptionsInput>
  }

  export type StudentProfileUpsertWithoutSubscriptionsInput = {
    update: XOR<StudentProfileUpdateWithoutSubscriptionsInput, StudentProfileUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<StudentProfileCreateWithoutSubscriptionsInput, StudentProfileUncheckedCreateWithoutSubscriptionsInput>
    where?: StudentProfileWhereInput
  }

  export type StudentProfileUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: StudentProfileWhereInput
    data: XOR<StudentProfileUpdateWithoutSubscriptionsInput, StudentProfileUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type StudentProfileUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentProfileNestedInput
    guardians?: StudentGuardianUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUpdateManyWithoutStudentProfileNestedInput
    licenses?: StudentLicenseUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guardians?: StudentGuardianUncheckedUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUncheckedUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    licenses?: StudentLicenseUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type FeePlanUpsertWithoutSubscriptionsInput = {
    update: XOR<FeePlanUpdateWithoutSubscriptionsInput, FeePlanUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<FeePlanCreateWithoutSubscriptionsInput, FeePlanUncheckedCreateWithoutSubscriptionsInput>
    where?: FeePlanWhereInput
  }

  export type FeePlanUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: FeePlanWhereInput
    data: XOR<FeePlanUpdateWithoutSubscriptionsInput, FeePlanUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type FeePlanUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: FloatFieldUpdateOperationsInput | number
  }

  export type FeePlanUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: FloatFieldUpdateOperationsInput | number
  }

  export type StudentLicenseCreateWithoutFederationInput = {
    id?: string
    licenseNumber: string
    validUntil: Date | string
    isActive?: boolean
    student: StudentProfileCreateNestedOneWithoutLicensesInput
  }

  export type StudentLicenseUncheckedCreateWithoutFederationInput = {
    id?: string
    studentProfileId: string
    licenseNumber: string
    validUntil: Date | string
    isActive?: boolean
  }

  export type StudentLicenseCreateOrConnectWithoutFederationInput = {
    where: StudentLicenseWhereUniqueInput
    create: XOR<StudentLicenseCreateWithoutFederationInput, StudentLicenseUncheckedCreateWithoutFederationInput>
  }

  export type StudentLicenseCreateManyFederationInputEnvelope = {
    data: StudentLicenseCreateManyFederationInput | StudentLicenseCreateManyFederationInput[]
    skipDuplicates?: boolean
  }

  export type StudentLicenseUpsertWithWhereUniqueWithoutFederationInput = {
    where: StudentLicenseWhereUniqueInput
    update: XOR<StudentLicenseUpdateWithoutFederationInput, StudentLicenseUncheckedUpdateWithoutFederationInput>
    create: XOR<StudentLicenseCreateWithoutFederationInput, StudentLicenseUncheckedCreateWithoutFederationInput>
  }

  export type StudentLicenseUpdateWithWhereUniqueWithoutFederationInput = {
    where: StudentLicenseWhereUniqueInput
    data: XOR<StudentLicenseUpdateWithoutFederationInput, StudentLicenseUncheckedUpdateWithoutFederationInput>
  }

  export type StudentLicenseUpdateManyWithWhereWithoutFederationInput = {
    where: StudentLicenseScalarWhereInput
    data: XOR<StudentLicenseUpdateManyMutationInput, StudentLicenseUncheckedUpdateManyWithoutFederationInput>
  }

  export type StudentProfileCreateWithoutLicensesInput = {
    id?: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentProfileInput
    guardians?: StudentGuardianCreateNestedManyWithoutStudentInput
    ranks?: StudentRankCreateNestedManyWithoutStudentInput
    attendances?: AttendanceCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileUncheckedCreateWithoutLicensesInput = {
    id?: string
    userId: string
    birthDate?: Date | string | null
    phone?: string | null
    address?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    guardians?: StudentGuardianUncheckedCreateNestedManyWithoutStudentInput
    ranks?: StudentRankUncheckedCreateNestedManyWithoutStudentInput
    attendances?: AttendanceUncheckedCreateNestedManyWithoutStudentInput
    updateRequests?: ProfileUpdateRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    promotionRequests?: PromotionRequestUncheckedCreateNestedManyWithoutStudentProfileInput
    subscriptions?: StudentSubscriptionUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentProfileCreateOrConnectWithoutLicensesInput = {
    where: StudentProfileWhereUniqueInput
    create: XOR<StudentProfileCreateWithoutLicensesInput, StudentProfileUncheckedCreateWithoutLicensesInput>
  }

  export type FederationCreateWithoutLicensesInput = {
    id?: string
    name: string
    country: string
  }

  export type FederationUncheckedCreateWithoutLicensesInput = {
    id?: string
    name: string
    country: string
  }

  export type FederationCreateOrConnectWithoutLicensesInput = {
    where: FederationWhereUniqueInput
    create: XOR<FederationCreateWithoutLicensesInput, FederationUncheckedCreateWithoutLicensesInput>
  }

  export type StudentProfileUpsertWithoutLicensesInput = {
    update: XOR<StudentProfileUpdateWithoutLicensesInput, StudentProfileUncheckedUpdateWithoutLicensesInput>
    create: XOR<StudentProfileCreateWithoutLicensesInput, StudentProfileUncheckedCreateWithoutLicensesInput>
    where?: StudentProfileWhereInput
  }

  export type StudentProfileUpdateToOneWithWhereWithoutLicensesInput = {
    where?: StudentProfileWhereInput
    data: XOR<StudentProfileUpdateWithoutLicensesInput, StudentProfileUncheckedUpdateWithoutLicensesInput>
  }

  export type StudentProfileUpdateWithoutLicensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentProfileNestedInput
    guardians?: StudentGuardianUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUpdateManyWithoutStudentNestedInput
  }

  export type StudentProfileUncheckedUpdateWithoutLicensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    guardians?: StudentGuardianUncheckedUpdateManyWithoutStudentNestedInput
    ranks?: StudentRankUncheckedUpdateManyWithoutStudentNestedInput
    attendances?: AttendanceUncheckedUpdateManyWithoutStudentNestedInput
    updateRequests?: ProfileUpdateRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    promotionRequests?: PromotionRequestUncheckedUpdateManyWithoutStudentProfileNestedInput
    subscriptions?: StudentSubscriptionUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type FederationUpsertWithoutLicensesInput = {
    update: XOR<FederationUpdateWithoutLicensesInput, FederationUncheckedUpdateWithoutLicensesInput>
    create: XOR<FederationCreateWithoutLicensesInput, FederationUncheckedCreateWithoutLicensesInput>
    where?: FederationWhereInput
  }

  export type FederationUpdateToOneWithWhereWithoutLicensesInput = {
    where?: FederationWhereInput
    data: XOR<FederationUpdateWithoutLicensesInput, FederationUncheckedUpdateWithoutLicensesInput>
  }

  export type FederationUpdateWithoutLicensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
  }

  export type FederationUncheckedUpdateWithoutLicensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
  }

  export type ProfileUpdateRequestCreateManyReviewerInput = {
    id?: string
    studentProfileId: string
    requestedChanges: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromotionRequestCreateManyProposedByInput = {
    id?: string
    studentProfileId: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    approvedById?: string | null
    status?: $Enums.RequestStatus
    createdAt?: Date | string
  }

  export type PromotionRequestCreateManyApprovedByInput = {
    id?: string
    studentProfileId: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    proposedById: string
    status?: $Enums.RequestStatus
    createdAt?: Date | string
  }

  export type ProfileUpdateRequestUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedChanges?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneRequiredWithoutUpdateRequestsNestedInput
  }

  export type ProfileUpdateRequestUncheckedUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    requestedChanges?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUpdateRequestUncheckedUpdateManyWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    requestedChanges?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionRequestUpdateWithoutProposedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneRequiredWithoutPromotionRequestsNestedInput
    approvedBy?: UserUpdateOneWithoutApprovedPromotionsNestedInput
  }

  export type PromotionRequestUncheckedUpdateWithoutProposedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    approvedById?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionRequestUncheckedUpdateManyWithoutProposedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    approvedById?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionRequestUpdateWithoutApprovedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    studentProfile?: StudentProfileUpdateOneRequiredWithoutPromotionRequestsNestedInput
    proposedBy?: UserUpdateOneRequiredWithoutProposedPromotionsNestedInput
  }

  export type PromotionRequestUncheckedUpdateWithoutApprovedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    proposedById?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionRequestUncheckedUpdateManyWithoutApprovedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    proposedById?: StringFieldUpdateOperationsInput | string
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentGuardianCreateManyStudentInput = {
    guardianId: string
    relationship?: string | null
  }

  export type StudentRankCreateManyStudentInput = {
    id?: string
    beltRankId: string
    currentStripes?: number
    accumulatedHours?: number
    promotedAt?: Date | string
    lastStripeAt?: Date | string
  }

  export type AttendanceCreateManyStudentInput = {
    id?: string
    date?: Date | string
    countedForRank?: boolean
  }

  export type ProfileUpdateRequestCreateManyStudentProfileInput = {
    id?: string
    requestedChanges: JsonNullValueInput | InputJsonValue
    status?: $Enums.RequestStatus
    reviewedById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromotionRequestCreateManyStudentProfileInput = {
    id?: string
    proposedBeltId?: string | null
    proposedStripes?: number | null
    proposedById: string
    approvedById?: string | null
    status?: $Enums.RequestStatus
    createdAt?: Date | string
  }

  export type StudentSubscriptionCreateManyStudentInput = {
    id?: string
    feePlanId: string
    isActive?: boolean
    mandateReference?: string | null
  }

  export type StudentLicenseCreateManyStudentInput = {
    id?: string
    federationId: string
    licenseNumber: string
    validUntil: Date | string
    isActive?: boolean
  }

  export type StudentGuardianUpdateWithoutStudentInput = {
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    guardian?: GuardianUpdateOneRequiredWithoutStudentsNestedInput
  }

  export type StudentGuardianUncheckedUpdateWithoutStudentInput = {
    guardianId?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StudentGuardianUncheckedUpdateManyWithoutStudentInput = {
    guardianId?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StudentRankUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStripes?: IntFieldUpdateOperationsInput | number
    accumulatedHours?: IntFieldUpdateOperationsInput | number
    promotedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastStripeAt?: DateTimeFieldUpdateOperationsInput | Date | string
    beltRank?: BeltRankUpdateOneRequiredWithoutStudentRanksNestedInput
  }

  export type StudentRankUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    beltRankId?: StringFieldUpdateOperationsInput | string
    currentStripes?: IntFieldUpdateOperationsInput | number
    accumulatedHours?: IntFieldUpdateOperationsInput | number
    promotedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastStripeAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentRankUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    beltRankId?: StringFieldUpdateOperationsInput | string
    currentStripes?: IntFieldUpdateOperationsInput | number
    accumulatedHours?: IntFieldUpdateOperationsInput | number
    promotedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastStripeAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttendanceUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    countedForRank?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AttendanceUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    countedForRank?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AttendanceUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    countedForRank?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProfileUpdateRequestUpdateWithoutStudentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedChanges?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewer?: UserUpdateOneWithoutReviewedUpdatesNestedInput
  }

  export type ProfileUpdateRequestUncheckedUpdateWithoutStudentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedChanges?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUpdateRequestUncheckedUpdateManyWithoutStudentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedChanges?: JsonNullValueInput | InputJsonValue
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionRequestUpdateWithoutStudentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    proposedBy?: UserUpdateOneRequiredWithoutProposedPromotionsNestedInput
    approvedBy?: UserUpdateOneWithoutApprovedPromotionsNestedInput
  }

  export type PromotionRequestUncheckedUpdateWithoutStudentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    proposedById?: StringFieldUpdateOperationsInput | string
    approvedById?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionRequestUncheckedUpdateManyWithoutStudentProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    proposedBeltId?: NullableStringFieldUpdateOperationsInput | string | null
    proposedStripes?: NullableIntFieldUpdateOperationsInput | number | null
    proposedById?: StringFieldUpdateOperationsInput | string
    approvedById?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentSubscriptionUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mandateReference?: NullableStringFieldUpdateOperationsInput | string | null
    feePlan?: FeePlanUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type StudentSubscriptionUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    feePlanId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mandateReference?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StudentSubscriptionUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    feePlanId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mandateReference?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StudentLicenseUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    federation?: FederationUpdateOneRequiredWithoutLicensesNestedInput
  }

  export type StudentLicenseUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    federationId?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StudentLicenseUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    federationId?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StudentGuardianCreateManyGuardianInput = {
    studentProfileId: string
    relationship?: string | null
  }

  export type StudentGuardianUpdateWithoutGuardianInput = {
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
    student?: StudentProfileUpdateOneRequiredWithoutGuardiansNestedInput
  }

  export type StudentGuardianUncheckedUpdateWithoutGuardianInput = {
    studentProfileId?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StudentGuardianUncheckedUpdateManyWithoutGuardianInput = {
    studentProfileId?: StringFieldUpdateOperationsInput | string
    relationship?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DisciplineProgramCreateManyDisciplineInput = {
    id?: string
    name: string
    minAge?: number
    maxAge?: number
  }

  export type DisciplineProgramUpdateWithoutDisciplineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    minAge?: IntFieldUpdateOperationsInput | number
    maxAge?: IntFieldUpdateOperationsInput | number
    beltRanks?: BeltRankUpdateManyWithoutProgramNestedInput
  }

  export type DisciplineProgramUncheckedUpdateWithoutDisciplineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    minAge?: IntFieldUpdateOperationsInput | number
    maxAge?: IntFieldUpdateOperationsInput | number
    beltRanks?: BeltRankUncheckedUpdateManyWithoutProgramNestedInput
  }

  export type DisciplineProgramUncheckedUpdateManyWithoutDisciplineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    minAge?: IntFieldUpdateOperationsInput | number
    maxAge?: IntFieldUpdateOperationsInput | number
  }

  export type BeltRankCreateManyProgramInput = {
    id?: string
    name: string
    order: number
    maxStripes?: number
    minMonthsRequired?: number
    minHoursRequired?: number
  }

  export type BeltRankUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    maxStripes?: IntFieldUpdateOperationsInput | number
    minMonthsRequired?: IntFieldUpdateOperationsInput | number
    minHoursRequired?: IntFieldUpdateOperationsInput | number
    studentRanks?: StudentRankUpdateManyWithoutBeltRankNestedInput
  }

  export type BeltRankUncheckedUpdateWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    maxStripes?: IntFieldUpdateOperationsInput | number
    minMonthsRequired?: IntFieldUpdateOperationsInput | number
    minHoursRequired?: IntFieldUpdateOperationsInput | number
    studentRanks?: StudentRankUncheckedUpdateManyWithoutBeltRankNestedInput
  }

  export type BeltRankUncheckedUpdateManyWithoutProgramInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    maxStripes?: IntFieldUpdateOperationsInput | number
    minMonthsRequired?: IntFieldUpdateOperationsInput | number
    minHoursRequired?: IntFieldUpdateOperationsInput | number
  }

  export type StudentRankCreateManyBeltRankInput = {
    id?: string
    studentProfileId: string
    currentStripes?: number
    accumulatedHours?: number
    promotedAt?: Date | string
    lastStripeAt?: Date | string
  }

  export type StudentRankUpdateWithoutBeltRankInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentStripes?: IntFieldUpdateOperationsInput | number
    accumulatedHours?: IntFieldUpdateOperationsInput | number
    promotedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastStripeAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentProfileUpdateOneRequiredWithoutRanksNestedInput
  }

  export type StudentRankUncheckedUpdateWithoutBeltRankInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    currentStripes?: IntFieldUpdateOperationsInput | number
    accumulatedHours?: IntFieldUpdateOperationsInput | number
    promotedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastStripeAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentRankUncheckedUpdateManyWithoutBeltRankInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    currentStripes?: IntFieldUpdateOperationsInput | number
    accumulatedHours?: IntFieldUpdateOperationsInput | number
    promotedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastStripeAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentSubscriptionCreateManyFeePlanInput = {
    id?: string
    studentProfileId: string
    isActive?: boolean
    mandateReference?: string | null
  }

  export type StudentSubscriptionUpdateWithoutFeePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mandateReference?: NullableStringFieldUpdateOperationsInput | string | null
    student?: StudentProfileUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type StudentSubscriptionUncheckedUpdateWithoutFeePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mandateReference?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StudentSubscriptionUncheckedUpdateManyWithoutFeePlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    mandateReference?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StudentLicenseCreateManyFederationInput = {
    id?: string
    studentProfileId: string
    licenseNumber: string
    validUntil: Date | string
    isActive?: boolean
  }

  export type StudentLicenseUpdateWithoutFederationInput = {
    id?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    student?: StudentProfileUpdateOneRequiredWithoutLicensesNestedInput
  }

  export type StudentLicenseUncheckedUpdateWithoutFederationInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type StudentLicenseUncheckedUpdateManyWithoutFederationInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentProfileId?: StringFieldUpdateOperationsInput | string
    licenseNumber?: StringFieldUpdateOperationsInput | string
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StudentProfileCountOutputTypeDefaultArgs instead
     */
    export type StudentProfileCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StudentProfileCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GuardianCountOutputTypeDefaultArgs instead
     */
    export type GuardianCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GuardianCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DisciplineCountOutputTypeDefaultArgs instead
     */
    export type DisciplineCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DisciplineCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DisciplineProgramCountOutputTypeDefaultArgs instead
     */
    export type DisciplineProgramCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DisciplineProgramCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BeltRankCountOutputTypeDefaultArgs instead
     */
    export type BeltRankCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BeltRankCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FeePlanCountOutputTypeDefaultArgs instead
     */
    export type FeePlanCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FeePlanCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FederationCountOutputTypeDefaultArgs instead
     */
    export type FederationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FederationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StudentProfileDefaultArgs instead
     */
    export type StudentProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StudentProfileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GuardianDefaultArgs instead
     */
    export type GuardianArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GuardianDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StudentGuardianDefaultArgs instead
     */
    export type StudentGuardianArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StudentGuardianDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DisciplineDefaultArgs instead
     */
    export type DisciplineArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DisciplineDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DisciplineProgramDefaultArgs instead
     */
    export type DisciplineProgramArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DisciplineProgramDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BeltRankDefaultArgs instead
     */
    export type BeltRankArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BeltRankDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StudentRankDefaultArgs instead
     */
    export type StudentRankArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StudentRankDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AttendanceDefaultArgs instead
     */
    export type AttendanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AttendanceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProfileUpdateRequestDefaultArgs instead
     */
    export type ProfileUpdateRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProfileUpdateRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PromotionRequestDefaultArgs instead
     */
    export type PromotionRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PromotionRequestDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FeePlanDefaultArgs instead
     */
    export type FeePlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FeePlanDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StudentSubscriptionDefaultArgs instead
     */
    export type StudentSubscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StudentSubscriptionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FederationDefaultArgs instead
     */
    export type FederationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FederationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StudentLicenseDefaultArgs instead
     */
    export type StudentLicenseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StudentLicenseDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}