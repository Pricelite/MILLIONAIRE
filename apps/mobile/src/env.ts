type EnvLike = Record<string, string | undefined>;

export function getMobileApiUrl(env: EnvLike = process.env as EnvLike): string {
  return env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";
}
