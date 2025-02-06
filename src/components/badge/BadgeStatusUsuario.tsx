import { Badge } from "@/components/ui/badge";

function BadgeStatusUsuario({ status }: { status: string }) {
  return (
    <Badge className="bg-lc-secondary capitalize hover:bg-lc-secondary">
      {status.toLowerCase()}
    </Badge>
  );
}

export default BadgeStatusUsuario;
