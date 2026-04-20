import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Plus, Search, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';


export const Subjects = () => {
  const { subjects, topics, addSubject, deleteSubject, addTopic, deleteTopic } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubject, setExpandedSubject] = useState(null);

  // Mock handlers for demo purposes
  const handleAddSubject = () => {
    const name = prompt('Enter subject name:');
    if (name) {
      addSubject({ name, description: 'New subject description', color: '#' + Math.floor(Math.random() * 16777215).toString(16) });
    }
  };

  const handleAddTopic = (subjectId) => {
    const name = prompt('Enter topic name:');
    if (name) {
      addTopic({ name, subjectId, difficulty: 'Medium', status: 'Not Started', notes: '' });
    }
  };

  const filteredSubjects = subjects.filter((s) =>
  s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subjects & Topics</h1>
          <p className="text-muted-foreground mt-1">Manage your study curriculum and track topic progress.</p>
        </div>
        <Button onClick={handleAddSubject} className="gap-2">
          <Plus className="h-4 w-4" /> Add Subject
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search subjects..."
          className="pl-9 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} />
        
      </div>

      {filteredSubjects.length === 0 ?
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card border-dashed">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No subjects found</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-sm">
            You haven't added any subjects yet, or no subjects match your search.
          </p>
          <Button onClick={handleAddSubject} variant="outline">Create your first subject</Button>
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
          const subjectTopics = topics.filter((t) => t.subjectId === subject.id);
          const isExpanded = expandedSubject === subject.id;

          return (
            <Card key={subject.id} className="flex flex-col overflow-hidden">
                <div className="h-2 w-full" style={{ backgroundColor: subject.color || 'var(--primary)' }} />
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{subject.name}</CardTitle>
                    <button onClick={() => deleteSubject(subject.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <CardDescription className="line-clamp-2">{subject.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{subjectTopics.length} Topics</Badge>
                  </div>
                  
                  <div className="space-y-2 border-t pt-4">
                    <div
                    className="flex items-center justify-between cursor-pointer hover:text-primary transition-colors text-sm font-medium"
                    onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}>
                    
                      <span>Topics</span>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                    
                    {isExpanded &&
                  <div className="space-y-2 mt-2 animate-in fade-in slide-in-from-top-2">
                        {subjectTopics.length === 0 ?
                    <p className="text-xs text-muted-foreground italic">No topics yet.</p> :

                    subjectTopics.map((topic) =>
                    <div key={topic.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50 text-sm">
                              <span className="truncate pr-2">{topic.name}</span>
                              <Badge variant={topic.status === 'Completed' ? 'success' : topic.status === 'In Progress' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                                {topic.status}
                              </Badge>
                            </div>
                    )
                    }
                        <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs mt-2 gap-1 h-8 text-muted-foreground"
                      onClick={() => handleAddTopic(subject.id)}>
                      
                          <Plus className="h-3 w-3" /> Add Topic
                        </Button>
                      </div>
                  }
                  </div>
                </CardContent>
              </Card>);

        })}
        </div>
      }
    </div>);

};