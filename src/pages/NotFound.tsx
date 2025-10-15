import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold gradient-primary bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-bold">Page non trouvée</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="gradient-primary border-0 gap-2"
          >
            <Home className="h-4 w-4" />
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
