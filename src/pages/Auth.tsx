import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-2">LOADING</p>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Don't render the form if user is already logged in (will redirect)
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        await signUp(email, password, displayName);
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
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

          <Button type="submit" className="w-full font-mono tracking-wider" size="lg" disabled={submitting}>
            {submitting ? "LOADING..." : isLogin ? (
              <><LogIn className="w-4 h-4 mr-2" /> SIGN IN</>
            ) : (
              <><UserPlus className="w-4 h-4 mr-2" /> CREATE ACCOUNT</>
            )}
          </Button>
        </form>

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
