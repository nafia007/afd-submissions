import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Briefcase, DollarSign, Star, Search, X, Users } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CommunityFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTags: string[];
  onTagToggle: (tag: string) => void;
  popularTags: string[];
  showFollowingFilter?: boolean;
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All', icon: null },
  { value: 'following', label: 'Following', icon: Users },
  { value: 'general', label: 'Discussion', icon: FileText },
  { value: 'news', label: 'News', icon: FileText },
  { value: 'funding', label: 'Funding', icon: DollarSign },
  { value: 'jobs', label: 'Jobs', icon: Briefcase },
  { value: 'showcase', label: 'Showcase', icon: Star },
];

export default function CommunityFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  activeTags,
  onTagToggle,
  popularTags,
  showFollowingFilter = true,
}: CommunityFiltersProps) {
  const filterOptions = showFollowingFilter 
    ? FILTER_OPTIONS 
    : FILTER_OPTIONS.filter(f => f.value !== 'following');
  const hasActiveFilters = activeTags.length > 0 || searchQuery || activeFilter !== 'all';

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search posts, tags, or users..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background/50 border-border/50"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => onSearchChange('')}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Horizontal Filter Pills */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2">
          {filterOptions.map(option => {
            const isActive = activeFilter === option.value;
            return (
              <Button
                key={option.value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange(option.value)}
                className={`rounded-full gap-1.5 shrink-0 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-background/50 border-border/50 hover:bg-muted'
                }`}
              >
                {option.icon && <option.icon className="w-3.5 h-3.5" />}
                {option.label}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      {/* Popular tags */}
      {popularTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {popularTags.map(tag => {
            const isActive = activeTags.includes(tag);
            return (
              <Badge
                key={tag}
                variant={isActive ? "default" : "secondary"}
                className={`cursor-pointer text-xs transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => onTagToggle(tag)}
              >
                #{tag}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex flex-wrap gap-1.5">
            {activeFilter !== 'all' && (
              <Badge variant="outline" className="gap-1 text-xs bg-primary/10 border-primary/30">
                {FILTER_OPTIONS.find(f => f.value === activeFilter)?.label}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => onFilterChange('all')} 
                />
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="outline" className="gap-1 text-xs bg-primary/10 border-primary/30">
                "{searchQuery.slice(0, 15)}{searchQuery.length > 15 ? '...' : ''}"
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => onSearchChange('')} 
                />
              </Badge>
            )}
            {activeTags.map(tag => (
              <Badge key={tag} variant="outline" className="gap-1 text-xs bg-primary/10 border-primary/30">
                #{tag}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => onTagToggle(tag)} 
                />
              </Badge>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onFilterChange('all');
              onSearchChange('');
              activeTags.forEach(tag => onTagToggle(tag));
            }}
            className="text-xs text-muted-foreground hover:text-foreground shrink-0"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}