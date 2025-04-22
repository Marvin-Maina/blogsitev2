import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const ArticleFilter = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    onFilter(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <Input
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-1/2"
      />
      <Select onValueChange={(value) => setSelectedCategory(value)} defaultValue="">
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          <SelectItem value="Music">Music</SelectItem>
          <SelectItem value="Tech">Tech</SelectItem>
          <SelectItem value="Culture">Culture</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ArticleFilter;
