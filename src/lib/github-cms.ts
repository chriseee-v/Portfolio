const GITHUB_API = "https://api.github.com";

interface CommitResult {
  ok: boolean;
  sha?: string;
  error?: string;
}

export async function commitFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string
): Promise<CommitResult> {
  try {
    // Get current file SHA (needed for updates)
    const getRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    });

    let sha: string | undefined;
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    } else if (getRes.status !== 404) {
      return { ok: false, error: `GitHub API error: ${getRes.status}` };
    }

    const body: Record<string, unknown> = {
      message,
      content: btoa(unescape(encodeURIComponent(content))),
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!putRes.ok) {
      const err = await putRes.json();
      return { ok: false, error: err.message || `HTTP ${putRes.status}` };
    }

    const result = await putRes.json();
    return { ok: true, sha: result.content?.sha };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export function validateToken(token: string): boolean {
  return token.startsWith("ghp_") || token.startsWith("github_pat_");
}
