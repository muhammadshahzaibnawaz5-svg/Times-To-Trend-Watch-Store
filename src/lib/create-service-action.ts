import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { createServerClient } from '@/lib/supabase/server';

type ServiceConstructor<T> = new (supabase: SupabaseClient<Database>) => T;
type MethodKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export async function createServiceAction<
  TService,
  TMethod extends MethodKeys<TService>,
>(
  ServiceClass: ServiceConstructor<TService>,
  methodName: TMethod,
  ...args: TService[TMethod] extends (...methodArgs: infer TArgs) => any ? TArgs : never
): Promise<TService[TMethod] extends (...methodArgs: any[]) => infer TResult ? TResult : never> {
  const supabase = await createServerClient();
  const service = new ServiceClass(supabase);
  const method = (service[methodName] as unknown as Function).bind(service);
  return method(...(args as unknown[])) as TService[TMethod] extends (...methodArgs: any[]) => infer TResult ? TResult : never;
}
