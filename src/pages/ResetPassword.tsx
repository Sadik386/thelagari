import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      navigate("/");
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-4 text-center">
          <p className="font-mono text-sm text-muted-foreground mb-4">Invalid or expired reset link.</p>
          <Link to="/auth" className="text-primary hover:underline font-mono text-sm">Back to Sign In</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-4">
        <Link to="/auth" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> BACK
        </Link>

        <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">SECURITY</p>
        <h1 className="text-3xl font-bold mb-8">Set New Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs tracking-wider text-muted-foreground block mb-1.5">NEW PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border rounded-md px-4 py-3 font-mono text-sm text-foreground outline-none focus:border-primary transition-colors"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="font-mono text-xs tracking-wider text-muted-foreground block mb-1.5">CONFIRM PASSWORD</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-card border border-border rounded-md px-4 py-3 font-mono text-sm text-foreground outline-none focus:border-primary transition-colors"
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full font-mono tracking-wider" size="lg" disabled={loading}>
            {loading ? "UPDATING..." : <><KeyRound className="w-4 h-4 mr-2" /> UPDATE PASSWORD</>}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
