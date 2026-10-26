import type { Metadata } from "next";
import { ProfilePanel } from "@/features/profile/profile-panel";
import { T } from "@/features/i18n/text";
import { RouteScreen } from "@/features/shell/route-screen";
import { ButtonLink } from "@/shared/ui/button";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <RouteScreen routeId="profile">
      <ProfilePanel />
      <ButtonLink href="/rankings" variant="quiet">
        <T id="rankings" />
      </ButtonLink>
    </RouteScreen>
  );
}
