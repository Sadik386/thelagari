import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-4 text-center">
        <p className="font-mono text-sm text-muted-foreground mb-4">
          Password reset is not available in this version.
        </p>
        <Button variant="outline" asChild className="font-mono tracking-wider text-xs">
          <Link to="/auth"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
