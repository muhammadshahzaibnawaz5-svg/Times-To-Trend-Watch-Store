import type { SupabaseClient, PostgrestSingleResponse } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { ActionResult, PaginatedResult } from '@/types/common';

type QueryBuilder = ReturnType<SupabaseClient<Database>['from']>;

type ExecResult<T> = PostgrestSingleResponse<T>;

export class BaseRepository<T extends Record<string, unknown>> {
  constructor(
    protected supabase: SupabaseClient<Database>,
    protected tableName: string,
  ) {}

  async findById(id: string): Promise<ActionResult<T>> {
    console.log(`[${this.tableName}.findById] id=${id}`);
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      const msg = `Supabase SELECT failed on ${this.tableName}: ${error.message}`;
      console.error(`[${this.tableName}.findById] ${msg}`);
      return { data: null, error: msg };
    }
    return { data: data as unknown as T, error: null };
  }

  async findAll(options?: {
    columns?: string;
    orderBy?: { column: string; ascending?: boolean };
  }): Promise<ActionResult<T[]>> {
    let query = this.supabase.from(this.tableName).select(options?.columns || '*') as QueryBuilder;

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      }) as unknown as QueryBuilder;
    }

    const { data, error } = await query;

    if (error) {
      const msg = `Supabase SELECT failed on ${this.tableName}: ${error.message}`;
      console.error(`[${this.tableName}.findAll] ${msg}`);
      return { data: null, error: msg };
    }
    return { data: data as unknown as T[], error: null };
  }

  async findAllPaginated(params: {
    page?: number;
    pageSize?: number;
    columns?: string;
    orderBy?: { column: string; ascending?: boolean };
    filters?: (query: QueryBuilder) => QueryBuilder;
  }): Promise<PaginatedResult<T>> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.supabase
      .from(this.tableName)
      .select(params.columns || '*', { count: 'exact' }) as QueryBuilder;

    if (params.filters) {
      query = params.filters(query);
    }

    if (params.orderBy) {
      query = query.order(params.orderBy.column, {
        ascending: params.orderBy.ascending ?? true,
      }) as unknown as QueryBuilder;
    }

    const { data, count, error } = await query.range(from, to) as unknown as {
      data: unknown;
      count: number | null;
      error: { message: string } | null;
    };

    if (error) {
      console.error(`[${this.tableName}.findAllPaginated] ${error.message}`);
      return { data: [], count: 0, page, pageSize, totalPages: 0 };
    }

    return {
      data: (data || []) as T[],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  }

  async insert(values: Partial<T>): Promise<ActionResult<T>> {
    console.log(`[BaseRepository.insert] table=${this.tableName} values=`, JSON.stringify(values, (k, v) =>
      k === 'password' ? '***' : v
    ));

    const { data, error, status, statusText } = await (this.supabase.from(this.tableName) as unknown as {
      insert: (v: unknown) => {
        select: () => {
          single: () => Promise<{ data: unknown; error: unknown; status: number; statusText: string }>
        }
      };
    }).insert(values).select().single();

    console.log(`[BaseRepository.insert] table=${this.tableName} status=${status} statusText=${statusText} error=${error ? JSON.stringify(error) : 'null'} data=${data ? 'present' : 'null'}`);

    if (error) {
      const msg = typeof error === 'object' && error !== null
        ? ((error as Record<string, unknown>).message as string) || JSON.stringify(error)
        : String(error);
      console.log(`[BaseRepository.insert] FAILED: ${msg}`);
      return { data: null, error: msg };
    }
    return { data: data as T, error: null };
  }

  async update(id: string, values: Partial<T>): Promise<ActionResult<T>> {
    console.log(`[${this.tableName}.update] id=${id}`);
    const { data, error } = await (this.supabase.from(this.tableName) as unknown as {
      update: (v: unknown) => { eq: (c: string, v: string) => { select: () => { single: () => Promise<ExecResult<unknown>> } } };
    }).update(values).eq('id', id).select().single();

    if (error) {
      const msg = `Supabase UPDATE failed on ${this.tableName}: ${error.message}`;
      console.error(`[${this.tableName}.update] ${msg}`);
      return { data: null, error: msg };
    }
    if (!data) {
      const msg = `Supabase UPDATE failed on ${this.tableName}: no row found with id=${id}`;
      console.error(`[${this.tableName}.update] ${msg}`);
      return { data: null, error: msg };
    }
    return { data: data as T, error: null };
  }

  async delete(id: string): Promise<ActionResult<null>> {
    console.log(`[${this.tableName}.delete] id=${id}`);
    const { error, count } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', id) as unknown as { error: { message: string } | null; count: number | null };

    if (error) {
      const msg = `Supabase DELETE failed on ${this.tableName}: ${error.message}`;
      console.error(`[${this.tableName}.delete] ${msg}`);
      return { data: null, error: msg };
    }
    return { data: null, error: null };
  }

  async count(filter?: (query: QueryBuilder) => QueryBuilder): Promise<number> {
    let q = this.supabase.from(this.tableName).select('*', { count: 'exact', head: true }) as QueryBuilder;
    if (filter) q = filter(q);
    const { count, error } = await q as unknown as { count: number | null; error: { message: string } | null };
    if (error) return 0;
    return count || 0;
  }
}
