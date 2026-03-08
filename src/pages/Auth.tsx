import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-4"
      >
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> BACK
        </Link>

        <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">
          {isLogin ? "WELCOME BACK" : "JOIN US"}
        </p>
        <h1 className="text-3xl font-bold mb-8">{isLogin ? "Sign In" : "Create Account"}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="font-mono text-xs tracking-wider text-muted-foreground block mb-1.5">DISPLAY NAME</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-card border border-border rounded-md px-4 py-3 font-mono text-sm text-foreground outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          )}
          <div>
            <label className="font-mono text-xs tracking-wider text-muted-foreground block mb-1.5">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-card border border-border rounded-md px-4 py-3 font-mono text-sm text-foreground outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="font-mono text-xs tracking-wider text-muted-foreground block mb-1.5">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-border rounded-md px-4 py-3 font-mono text-sm text-foreground outline-none focus:border-primary transition-colors"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full font-mono tracking-wider" size="lg" disabled={loading}>
            {loading ? "LOADING..." : isLogin ? (
              <><LogIn className="w-4 h-4 mr-2" /> SIGN IN</>
            ) : (
              <><UserPlus className="w-4 h-4 mr-2" /> CREATE ACCOUNT</>
            )}
          </Button>
        </form>

        {isLogin && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={async () => {
                if (!email) {
                  toast.error("Enter your email first");
                  return;
                }
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) toast.error(error.message);
                else toast.success("Password reset link sent to your email!");
              }}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              Forgot password?
            </button>
          </div>
        )}

        <p className="text-center mt-4 text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
