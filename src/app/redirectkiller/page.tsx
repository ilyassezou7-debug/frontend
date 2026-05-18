"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

type Redirect = {
  id: string;
  slug: string;
  target_url: string;
};

export default function RedirectAdmin() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [slug, setSlug] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    try {
      const method = editingSlug ? "PUT" : "POST";
      const url = editingSlug 
        ? `${SITE_CONFIG.apiUrl}/api/redirects/${editingSlug}` 
        : `${SITE_CONFIG.apiUrl}/api/redirects`;
        
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ slug, target_url: targetUrl }),
      });

      if (res.ok) {
        setSlug("");
        setTargetUrl("");
        setEditingSlug(null);
        fetchRedirects();
      } else {
        let message = "Failed to save redirect";
        try {
          const data = await res.json();
          message = data.detail || message;
        } catch {}
        setError(message);
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
        let message = "Failed to delete";
        try {
          const data = await res.json();
          message = data.detail || message;
        } catch {}
        setError(message);
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{editingSlug ? "Edit Redirect" : "Create New Redirect"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    placeholder="e.g. killer"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target URL</label>
                  <Input
                    placeholder="e.g. /products/breath-drops"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    required
                  />
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
