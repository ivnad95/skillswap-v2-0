"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"; // Assuming button path
import { Input } from "@/components/ui/input"; // Assuming input path
import { Label } from "@/components/ui/label"; // Assuming label path
import { Textarea } from "@/components/ui/textarea"; // Assuming textarea path
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming card path
// TODO: Potentially add a Select component for category if available

export default function AddTeachingSkillPage() {
  const router = useRouter();
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // Or manage via Select
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Assuming the API can infer the user and knows this is a 'teaching' skill context
        // Or adjust the body/endpoint if needed based on API design
        body: JSON.stringify({ name: skillName, description, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to add skill');
      }

      // Redirect to the main skills page on success
      // Optionally redirect to the new skill's detail page: router.push(`/dashboard/skills/${data.skill.id}`);
      router.push('/dashboard/skills');

    } catch (err: any) {
      setError(err.message || 'An error occurred while adding the skill.');
      console.error("Error adding skill:", err);
      console.error("Error adding skill:", err);
      setLoading(false);
    }
    // No need to setLoading(false) here if redirecting on success
  };

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add a Skill You Can Teach</CardTitle>
          <CardDescription>Share your expertise with the community.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skillName">Skill Name</Label>
              <Input
                id="skillName"
                placeholder="e.g., Web Development, Guitar Basics"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {/* TODO: Replace with Select component if available */}
              <Input
                id="category"
                placeholder="e.g., Technology, Music, Arts"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the skill and what you can teach about it."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={loading}
                rows={4}
              />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Adding Skill...' : 'Add Skill'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
