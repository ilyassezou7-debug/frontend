"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, LogOut, ExternalLink } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

type Redirect = {
  id: string;
  slug: string;
  target_url: string;
};

// FastAPI returns `detail` as a string for HTTPExceptions and as an array of
// {loc, msg} objects for 422 validation errors — normalise both to a message.
async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    const detail = data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail.map((d) => d?.msg).filter(Boolean).join(", ") || fallback;
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

export default function RedirectAdmin() {
  const router = useRouter();
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [slug, setSlug] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/redirect-auth", { method: "DELETE" });
    router.push("/redirectkiller/login");
    router.refresh();
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    try {
      const res = await fetch(`${SITE_CONFIG.apiUrl}/api/redirects`);
      if (res.ok) {
        const data = await res.json();
        setRedirects(data);
        setError("");
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(`خطأ فالسيرفر (${res.status}): ${errorData.detail || "تأكد بلي قاديتي قاعدة البيانات"}`);
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanSlug = slug.trim().toLowerCase();
    const cleanTarget = targetUrl.trim();

    // Client-side validation (mirrors the backend rules)
    if (!cleanSlug) {
      setError("Slug is required");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) {
      setError(
        "Slug must be URL-safe: lowercase letters, numbers and single dashes only (e.g. breath-drops, argan-oil)"
      );
      return;
    }
    if (!cleanTarget) {
      setError("Target URL is required");
      return;
    }

    try {
      const method = editingSlug ? "PUT" : "POST";
      const url = editingSlug 
        ? `${SITE_CONFIG.apiUrl}/api/redirects/${editingSlug}` 
        : `${SITE_CONFIG.apiUrl}/api/redirects`;

      const normalizedTarget =
        cleanTarget.startsWith("http") || cleanTarget.startsWith("/")
          ? cleanTarget
          : `/${cleanTarget}`;

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ slug: cleanSlug, target_url: normalizedTarget }),
      });

      if (res.ok) {
        setSlug("");
        setTargetUrl("");
        setEditingSlug(null);
        fetchRedirects();
      } else {
        setError(await parseError(res, "Failed to save redirect"));
      }
    } catch (err) {
      setError("Failed to save redirect");
    }
  };

  const handleEdit = (r: Redirect) => {
    setSlug(r.slug);
    setTargetUrl(r.target_url);
    setEditingSlug(r.slug);
  };

  const handleDelete = async (slugToDelete: string) => {
    if (!confirm("Are you sure?")) return;
    setError("");
    try {
      const res = await fetch(`${SITE_CONFIG.apiUrl}/api/redirects/${slugToDelete}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchRedirects();
      } else {
        setError(await parseError(res, "Failed to delete"));
      }
    } catch (err) {
      setError("Failed to delete");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Redirect Management</h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{editingSlug ? "Edit Redirect" : "Create New Redirect"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug (ad identifier)</label>
                  <Input
                    placeholder="e.g. breath-drops"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Public ad link:{" "}
                    <span className="font-mono">
                      {SITE_CONFIG.siteUrl}/ads/{slug.trim().toLowerCase() || "your-slug"}
                    </span>
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target URL (destination)</label>
                  <Input
                    placeholder="e.g. /lp or https://atlaspure.shop/lp"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Where visitors land. You can change this anytime without touching the ad.
                  </p>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit">{editingSlug ? "Update" : "Create"}</Button>
                {editingSlug && (
                  <Button type="button" variant="outline" onClick={() => {
                    setEditingSlug(null);
                    setSlug("");
                    setTargetUrl("");
                  }}>Cancel</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Redirects</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redirects.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.slug}</TableCell>
                    <TableCell className="truncate max-w-xs" title={r.target_url}>{r.target_url}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => window.open(`/ads/${r.slug}`, '_blank')}
                          title="Test Redirect"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(r)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(r.slug)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {redirects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No redirects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
