"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Board } from "@/types/board";
import { toast } from "sonner";
import { Loader } from "@/components/Loader/loader";

interface EditBoardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  board: Board | null;
  onUpdated: () => void;
}

export function EditBoardModal({ open, onOpenChange, board, onUpdated }: EditBoardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (board) {
      setTitle(board.title);
      setDescription(board.description || "");
    }
  }, [board]);

  const handleSave = async () => {
    if (!board) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/board/${board.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const result = await res.json();
      if (!result.ok) throw new Error(result.error || "Error updating board");

      toast.success("Board updated successfully");
      onOpenChange(false);
      onUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Error updating board");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!board) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/board/${board.id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!result.ok) throw new Error(result.error || "Error deleting board");

      toast.success("Board deleted successfully");
      onOpenChange(false);
      onUpdated();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting board");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Board title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Board description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex flex-row justify-end gap-2">
            <Button
              onClick={handleDelete}
              variant="destructive"
            >
              Delete
            </Button>
            <Button onClick={handleSave} variant="midLight">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
