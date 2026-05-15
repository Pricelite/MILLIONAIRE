import { getSupabaseAuthClient, getSupabaseUserClient } from "@/lib/supabase/server";

type CompanyContext = {
  userId: string;
  companyId: string;
  accessToken: string;
  role: "owner" | "member";
};

type AuthUserContext = {
  userId: string;
  accessToken: string;
};

export class ApiAuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function isApiAuthEnforced() {
  return process.env.ENFORCE_API_AUTH === "true" || process.env.NODE_ENV === "production";
}

export function readBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export async function requireCompanyContext(request: Request): Promise<CompanyContext> {
  const token = readBearerToken(request);
  if (!token) {
    throw new ApiAuthError(401, "Authentification requise.");
  }

  const authClient = getSupabaseAuthClient();
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData.user) {
    throw new ApiAuthError(401, "Session invalide.");
  }

  const supabase = getSupabaseUserClient(token);
  const forcedCompanyId = request.headers.get("x-company-id")?.trim() || null;

  const ownerQuery = supabase
    .from("companies")
    .select("id")
    .eq("owner_id", userData.user.id)
    .limit(1);

  const { data: ownerCompanies, error: ownerError } = forcedCompanyId
    ? await ownerQuery.eq("id", forcedCompanyId)
    : await ownerQuery.order("created_at", { ascending: true });

  if (ownerError) {
    throw new ApiAuthError(403, "Impossible de verifier la societe.");
  }

  if (ownerCompanies && ownerCompanies.length > 0) {
    return {
      userId: userData.user.id,
      companyId: ownerCompanies[0].id as string,
      accessToken: token,
      role: "owner"
    };
  }

  const memberQuery = supabase
    .from("company_members")
    .select("company_id")
    .eq("user_id", userData.user.id)
    .limit(1);

  const { data: memberCompanies, error: memberError } = forcedCompanyId
    ? await memberQuery.eq("company_id", forcedCompanyId)
    : await memberQuery.order("created_at", { ascending: true });

  if (memberError) {
    throw new ApiAuthError(403, "Impossible de verifier l'appartenance societe.");
  }

  if (!memberCompanies || memberCompanies.length === 0) {
    throw new ApiAuthError(403, "Aucune societe accessible pour cet utilisateur.");
  }

  return {
    userId: userData.user.id,
    companyId: memberCompanies[0].company_id as string,
    accessToken: token,
    role: "member"
  };
}

export async function requireAuthenticatedUser(
  request: Request,
  options?: { optionalWhenNotEnforced?: boolean }
): Promise<AuthUserContext | null> {
  const token = readBearerToken(request);
  if (!token) {
    if (options?.optionalWhenNotEnforced && !isApiAuthEnforced()) {
      return null;
    }
    throw new ApiAuthError(401, "Authentification requise.");
  }

  const authClient = getSupabaseAuthClient();
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData.user) {
    throw new ApiAuthError(401, "Session invalide.");
  }

  return {
    userId: userData.user.id,
    accessToken: token
  };
}
