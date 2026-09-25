/** Fixed scope for this high-cost badge. Never accept arbitrary owner input. */
export function resolveWorkflowOwners(username: string | null, orgs: string | null): string[] | null {
  if (username?.toLowerCase() !== "rowkav09" || (orgs !== null && orgs.toLowerCase() !== "rowkavdev")) return null;
  return ["rowkav09", ...(orgs === null ? [] : ["rowkavdev"])];
}
