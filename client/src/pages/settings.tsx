import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building2, Users, Bell, CreditCard, Globe } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [hotelName, setHotelName] = useState("Le Grand Hotel");
  const [email, setEmail] = useState("info@legrandhotel.ht");
  const [phone, setPhone] = useState("+509 2812-3456");
  const [currency, setCurrency] = useState("HTG");
  const [timezone, setTimezone] = useState("America/Port-au-Prince");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your hotel and account settings.</p>
      </div>

      <Tabs defaultValue="hotel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hotel" data-testid="tab-hotel">
            <Building2 className="w-4 h-4 mr-2" />
            Hotel
          </TabsTrigger>
          <TabsTrigger value="team" data-testid="tab-team">
            <Users className="w-4 h-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" data-testid="tab-billing">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hotel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
              <CardDescription>Update your hotel's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hotel-name">Hotel Name</Label>
                <Input
                  id="hotel-name"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  data-testid="input-hotel-name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    data-testid="input-phone"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  defaultValue="123 Main Street, Port-au-Prince, Haiti"
                  data-testid="input-address"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button data-testid="button-save-hotel">Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure currency and timezone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency" data-testid="select-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HTG">HTG - Haitian Gourde</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone" data-testid="select-timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Port-au-Prince">Port-au-Prince (EST)</SelectItem>
                      <SelectItem value="America/New_York">New York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button data-testid="button-save-regional">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your hotel staff and their access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="font-medium">Jean Dupont</p>
                    <p className="text-sm text-muted-foreground">Owner</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="font-medium">Marie Laurent</p>
                    <p className="text-sm text-muted-foreground">Receptionist</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pierre Duval</p>
                    <p className="text-sm text-muted-foreground">Restaurant Manager</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button data-testid="button-invite-member">
                <Users className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  data-testid="switch-email-notifications"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                  data-testid="switch-sms-notifications"
                />
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>Notification Types</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New reservations</span>
                    <Switch defaultChecked data-testid="switch-new-reservations" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low inventory alerts</span>
                    <Switch defaultChecked data-testid="switch-inventory-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment confirmations</span>
                    <Switch defaultChecked data-testid="switch-payment-confirmations" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button data-testid="button-save-notifications">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently on the Pro plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-semibold text-lg">Pro Plan</h3>
                  <p className="text-sm text-muted-foreground">Unlimited rooms, full features</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-2xl">2,200 HTG</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Plan Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Unlimited rooms</li>
                  <li>✓ Restaurant management</li>
                  <li>✓ Advanced reports</li>
                  <li>✓ Email support</li>
                  <li>✓ Multi-user access</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" data-testid="button-change-plan">Change Plan</Button>
              <Button variant="outline" data-testid="button-billing-history">Billing History</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" data-testid="button-update-payment">
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
