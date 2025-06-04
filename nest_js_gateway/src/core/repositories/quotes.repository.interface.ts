/**
 * Quotes repository interface
 *
 * Implementations:
 * - {@link PermissionRepository} - Production Prisma/PostgreSQL implementation
 */
export interface IQuotesRepository {
  findMatchingQuote(emotion: string): Promise<string>;
}
