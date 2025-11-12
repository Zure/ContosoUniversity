import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function DesignSystemTest() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Design System Test</h1>
      
      {/* Color Palette Test */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Testing semantic color classes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <div className="bg-primary text-primary-foreground p-4 rounded">Primary</div>
            <div className="bg-secondary text-secondary-foreground p-4 rounded">Secondary</div>
            <div className="bg-muted text-muted-foreground p-4 rounded">Muted</div>
            <div className="bg-accent text-accent-foreground p-4 rounded">Accent</div>
            <div className="bg-destructive text-destructive-foreground p-4 rounded">Destructive</div>
          </div>
        </CardContent>
      </Card>

      {/* Typography Scale Test */}
      <Card>
        <CardHeader>
          <CardTitle>Typography Scale</CardTitle>
          <CardDescription>Testing text sizes from text-xs to text-3xl</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs">Extra Small Text (text-xs) - 12px</p>
          <p className="text-sm">Small Text (text-sm) - 14px</p>
          <p className="text-base">Base Text (text-base) - 16px</p>
          <p className="text-lg">Large Text (text-lg) - 18px</p>
          <p className="text-xl">Extra Large Text (text-xl) - 20px</p>
          <p className="text-2xl">2XL Text (text-2xl) - 24px</p>
          <p className="text-3xl">3XL Text (text-3xl) - 30px</p>
        </CardContent>
      </Card>

      {/* Spacing System Test */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing System</CardTitle>
          <CardDescription>Testing padding and margin values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-2 rounded">Padding: p-2 (8px)</div>
          <div className="bg-muted p-4 rounded">Padding: p-4 (16px)</div>
          <div className="bg-muted p-6 rounded">Padding: p-6 (24px)</div>
          <div className="bg-muted p-8 rounded">Padding: p-8 (32px)</div>
        </CardContent>
      </Card>

      {/* Component Test */}
      <Card>
        <CardHeader>
          <CardTitle>Component Test</CardTitle>
          <CardDescription>Testing Button and Input components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button variant="default">Default Button</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="test-input">Test Input</Label>
            <Input id="test-input" placeholder="Enter text..." />
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">All components are working correctly</p>
        </CardFooter>
      </Card>

      {/* Responsive Breakpoint Test */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Breakpoints</CardTitle>
          <CardDescription>Resize browser to test breakpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-primary text-primary-foreground p-4 rounded text-center">
              1 col mobile
            </div>
            <div className="bg-secondary text-secondary-foreground p-4 rounded text-center">
              2 col tablet
            </div>
            <div className="bg-accent text-accent-foreground p-4 rounded text-center">
              3 col desktop
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Component Test */}
      <Card>
        <CardHeader>
          <CardTitle>Table Component</CardTitle>
          <CardDescription>Testing Table component with sample data</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Item 1</TableCell>
                <TableCell>Active</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Item 2</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell className="text-right">$150.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Item 3</TableCell>
                <TableCell>Inactive</TableCell>
                <TableCell className="text-right">$350.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Select Component Test */}
      <Card>
        <CardHeader>
          <CardTitle>Select Component</CardTitle>
          <CardDescription>Testing Select dropdown component</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="select-demo">Choose an option</Label>
            <Select>
              <SelectTrigger id="select-demo" className="w-[280px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
                <SelectItem value="pear">Pear</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Component Test */}
      <Card>
        <CardHeader>
          <CardTitle>Dialog Component</CardTitle>
          <CardDescription>Testing Dialog modal component</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a demo dialog showcasing the Dialog component from shadcn/ui.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" defaultValue="John Doe" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input id="username" defaultValue="@johndoe" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Accessibility Note */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Testing</CardTitle>
          <CardDescription>All components support keyboard navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Use <kbd className="px-2 py-1 bg-muted rounded border">Tab</kbd> to navigate between interactive elements</li>
            <li>Press <kbd className="px-2 py-1 bg-muted rounded border">Enter</kbd> or <kbd className="px-2 py-1 bg-muted rounded border">Space</kbd> to activate buttons</li>
            <li>Use <kbd className="px-2 py-1 bg-muted rounded border">Esc</kbd> to close dialogs and dropdowns</li>
            <li>All form inputs have associated labels for screen readers</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
