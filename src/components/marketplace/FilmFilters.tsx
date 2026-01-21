
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface FilmFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  genre?: string;
  budgetMin?: number;
  budgetMax?: number;
  completionStatus?: string;
  priceMin?: number;
  priceMax?: number;
}

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 
  'Sci-Fi', 'Thriller', 'Romance', 'Documentary', 'Animation'
];

const completionStatuses = [
  { value: 'pre_production', label: 'Pre-Production' },
  { value: 'in_production', label: 'In Production' },
  { value: 'post_production', label: 'Post-Production' },
  { value: 'completed', label: 'Completed' },
  { value: 'distributed', label: 'Distributed' }
];

const FilmFilters = ({ onFiltersChange }: FilmFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({});
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Genre</label>
              <Select
                value={filters.genre || ""}
                onValueChange={(value) => updateFilters({ genre: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Completion Status</label>
              <Select
                value={filters.completionStatus || ""}
                onValueChange={(value) => updateFilters({ completionStatus: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {completionStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Price Range (ETH)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin || ""}
                  onChange={(e) => updateFilters({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax || ""}
                  onChange={(e) => updateFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Budget Range ($)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min budget"
                  value={filters.budgetMin || ""}
                  onChange={(e) => updateFilters({ budgetMin: e.target.value ? Number(e.target.value) : undefined })}
                />
                <Input
                  type="number"
                  placeholder="Max budget"
                  value={filters.budgetMax || ""}
                  onChange={(e) => updateFilters({ budgetMax: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FilmFilters;
