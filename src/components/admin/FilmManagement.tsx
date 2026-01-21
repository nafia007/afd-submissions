import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Film, Plus, List, Play, ExternalLink } from "lucide-react";
import { AdminFilmUpload } from "./AdminFilmUpload";

export const FilmManagement = () => {
  const [editingFilm, setEditingFilm] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: films, isLoading } = useQuery({
    queryKey: ["admin-films"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("films")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateFilmMutation = useMutation({
    mutationFn: async (film: any) => {
      const { id, ...updateData } = film;
      const { error } = await supabase
        .from("films")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-films"] });
      toast.success("Film updated successfully");
      setIsDialogOpen(false);
      setEditingFilm(null);
    },
    onError: (error) => {
      toast.error("Failed to update film", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const deleteFilmMutation = useMutation({
    mutationFn: async (filmId: string) => {
      const { error } = await supabase
        .from("films")
        .delete()
        .eq("id", filmId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-films"] });
      toast.success("Film deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete film", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingFilm) return;

    const formData = new FormData(e.currentTarget);
    updateFilmMutation.mutate({
      id: editingFilm.id,
      title: formData.get("title") as string,
      director: formData.get("director") as string,
      description: formData.get("description") as string,
      genre: formData.get("genre") as string,
      year: formData.get("year") as string,
      price: formData.get("price") as string,
      poster_url: formData.get("poster_url") as string,
      film_url: formData.get("film_url") as string,
      video_url: formData.get("video_url") as string,
    });
  };

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-films"] });
  };

  const openVideoUrl = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="w-5 h-5" />
          Film Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Manage Films ({films?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Film
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {isLoading ? (
              <div className="text-center py-8">Loading films...</div>
            ) : films?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No films found. Add your first film using the "Add New Film" tab.
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Poster</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Director</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Video</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {films?.map((film) => (
                      <TableRow key={film.id}>
                        <TableCell>
                          {film.poster_url ? (
                            <img
                              src={film.poster_url}
                              alt={film.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                              <Film className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {film.title}
                        </TableCell>
                        <TableCell>{film.director}</TableCell>
                        <TableCell>{film.genre || "N/A"}</TableCell>
                        <TableCell>{film.year || "N/A"}</TableCell>
                        <TableCell>${film.price}</TableCell>
                        <TableCell>
                          {(film.film_url || film.video_url) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openVideoUrl(film.video_url || film.film_url)}
                            >
                              <Play className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog
                              open={isDialogOpen && editingFilm?.id === film.id}
                              onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) setEditingFilm(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingFilm(film);
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Film</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                  <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                          id="title"
                                          name="title"
                                          defaultValue={editingFilm?.title}
                                          required
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="director">Director</Label>
                                        <Input
                                          id="director"
                                          name="director"
                                          defaultValue={editingFilm?.director}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor="description">Description</Label>
                                      <Textarea
                                        id="description"
                                        name="description"
                                        defaultValue={editingFilm?.description || ""}
                                        rows={3}
                                      />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                      <div>
                                        <Label htmlFor="genre">Genre</Label>
                                        <Input
                                          id="genre"
                                          name="genre"
                                          defaultValue={editingFilm?.genre || ""}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="year">Year</Label>
                                        <Input
                                          id="year"
                                          name="year"
                                          defaultValue={editingFilm?.year || ""}
                                          placeholder="2024"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                          id="price"
                                          name="price"
                                          type="number"
                                          step="0.01"
                                          defaultValue={editingFilm?.price}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor="poster_url">Poster URL</Label>
                                      <Input
                                        id="poster_url"
                                        name="poster_url"
                                        type="url"
                                        defaultValue={editingFilm?.poster_url || ""}
                                        placeholder="https://..."
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="film_url">Film URL</Label>
                                      <Input
                                        id="film_url"
                                        name="film_url"
                                        type="url"
                                        defaultValue={editingFilm?.film_url}
                                        required
                                      />
                                      {editingFilm?.film_url && (
                                        <Button
                                          type="button"
                                          variant="link"
                                          size="sm"
                                          className="p-0 h-auto mt-1"
                                          onClick={() => openVideoUrl(editingFilm.film_url)}
                                        >
                                          <ExternalLink className="w-3 h-3 mr-1" />
                                          Open current URL
                                        </Button>
                                      )}
                                    </div>
                                    <div>
                                      <Label htmlFor="video_url">Trailer/Preview URL</Label>
                                      <Input
                                        id="video_url"
                                        name="video_url"
                                        type="url"
                                        defaultValue={editingFilm?.video_url || ""}
                                        placeholder="https://..."
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        setIsDialogOpen(false);
                                        setEditingFilm(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button type="submit">Save Changes</Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Delete "${film.title}"?`)) {
                                  deleteFilmMutation.mutate(film.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload">
            <AdminFilmUpload onSuccess={handleUploadSuccess} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
