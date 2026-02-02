"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/auth";
import { toast } from "sonner";
import Script from "next/script";

interface SocialLoginButtonsProps {
  onSuccess?: () => void;
}

export function SocialLoginButtons({ onSuccess }: SocialLoginButtonsProps) {
  const router = useRouter();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [googleSDKReady, setGoogleSDKReady] = useState(false);

  // Google Login
  const handleGoogleLogin = useCallback(() => {
    setSocialLoading("google");

    // Wait for SDK to be ready with retry mechanism
    const tryGoogleLogin = (retries = 5) => {
      // @ts-ignore - google is loaded via script
      if (
        typeof window !== "undefined" &&
        (window as any).google?.accounts?.oauth2
      ) {
        try {
          const currentOrigin =
            typeof window !== "undefined" ? window.location.origin : "";
          console.log("Google Sign-In origin:", currentOrigin);

          // @ts-ignore
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
            scope: "openid profile email",
            // Explicitly set the redirect URI to current origin
            // This ensures it matches what's configured in Google Cloud Console
            redirect_uri: currentOrigin,
            callback: async (response: any) => {
              try {
                if (response.error) {
                  console.error("Google OAuth error:", response.error);
                  toast.error(
                    response.error_description || "Google login failed"
                  );
                  setSocialLoading(null);
                  return;
                }

                // Send the access token - backend will verify it
                await authService.googleLogin(response.access_token, true);
                toast.success("Google login successful!");
                if (onSuccess) {
                  onSuccess();
                } else {
                  router.push("/home");
                }
              } catch (error: any) {
                console.error("Google login API error:", error);
                toast.error(error.message || "Google login failed");
              } finally {
                setSocialLoading(null);
              }
            },
          });
          client.requestAccessToken();
        } catch (error: any) {
          console.error("Google login initialization error:", error);
          toast.error("Failed to initialize Google login. Please try again.");
          setSocialLoading(null);
        }
      } else if (retries > 0) {
        // Retry after a short delay
        setTimeout(() => tryGoogleLogin(retries - 1), 200);
      } else {
        toast.error("Google SDK not loaded. Please refresh the page.");
        setSocialLoading(null);
      }
    };

    tryGoogleLogin();
  }, [onSuccess, router]);

  // Facebook Login
  const handleFacebookLogin = useCallback(() => {
    setSocialLoading("facebook");

    // Wait for SDK to be ready with retry mechanism
    const tryFacebookLogin = (retries = 5) => {
      // @ts-ignore - FB is loaded via script
      if (typeof window !== "undefined" && (window as any).FB) {
        try {
          // @ts-ignore
          window.FB.login(
            async (response: any) => {
              if (response.authResponse) {
                try {
                  await authService.facebookLogin(
                    response.authResponse.accessToken
                  );
                  toast.success("Facebook login successful!");
                  if (onSuccess) {
                    onSuccess();
                  } else {
                    router.push("/home");
                  }
                } catch (error: any) {
                  console.error("Facebook login API error:", error);
                  toast.error(error.message || "Facebook login failed");
                } finally {
                  setSocialLoading(null);
                }
              } else {
                if (response.status !== "unknown") {
                  toast.error("Facebook login cancelled");
                }
                setSocialLoading(null);
              }
            },
            { scope: "email,public_profile" }
          );
        } catch (error: any) {
          console.error("Facebook login initialization error:", error);
          toast.error("Failed to initialize Facebook login. Please try again.");
          setSocialLoading(null);
        }
      } else if (retries > 0) {
        // Retry after a short delay
        setTimeout(() => tryFacebookLogin(retries - 1), 200);
      } else {
        toast.error("Facebook SDK not loaded. Please refresh the page.");
        setSocialLoading(null);
      }
    };

    tryFacebookLogin();
  }, [onSuccess, router]);

  // Apple Login
  const handleAppleLogin = useCallback(() => {
    setSocialLoading("apple");
    // @ts-ignore - AppleID is loaded via script
    if (typeof window !== "undefined" && window.AppleID) {
      // @ts-ignore
      window.AppleID.auth.signIn({
        requestedScopes: ["name", "email"],
        success: async (response: any) => {
          try {
            await authService.appleLogin(response.id_token, response.user);
            toast.success("Apple login successful!");
            if (onSuccess) {
              onSuccess();
            } else {
              router.push("/home");
            }
          } catch (error: any) {
            toast.error(error.message || "Apple login failed");
          } finally {
            setSocialLoading(null);
          }
        },
        failure: (error: any) => {
          toast.error("Apple login failed");
          setSocialLoading(null);
        },
      });
    } else {
      toast.error("Apple Sign In SDK not loaded. Please refresh the page.");
      setSocialLoading(null);
    }
  }, [onSuccess, router]);

  return (
    <>
      {/* Google Identity Services */}
      {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <Script
          id="google-identity"
          strategy="afterInteractive"
          src="https://accounts.google.com/gsi/client"
          onLoad={() => {
            // @ts-ignore
            if (typeof window !== "undefined" && window.google) {
              setGoogleSDKReady(true);
              console.log("Google Identity Services SDK loaded successfully");
            }
          }}
          onError={() => {
            console.error("Failed to load Google Identity Services SDK");
            toast.error(
              "Failed to load Google Sign-In. Please refresh the page."
            );
          }}
        />
      )}

      {/* Facebook SDK */}
      {process.env.NEXT_PUBLIC_FACEBOOK_APP_ID && (
        <Script
          id="facebook-jssdk"
          strategy="afterInteractive"
          src="https://connect.facebook.net/en_US/sdk.js"
          onLoad={() => {
            // @ts-ignore
            if (typeof window !== "undefined" && window.FB) {
              // @ts-ignore
              window.FB.init({
                appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
                cookie: true,
                xfbml: true,
                version: "v18.0",
              });
              console.log("Facebook SDK loaded successfully");
            }
          }}
          onError={() => {
            console.error("Failed to load Facebook SDK");
          }}
        />
      )}

      {/* Apple Sign In SDK */}
      {process.env.NEXT_PUBLIC_APPLE_CLIENT_ID && (
        <Script
          id="apple-signin"
          strategy="lazyOnLoad"
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
          onLoad={() => {
            // @ts-ignore
            if (typeof window !== "undefined" && window.AppleID) {
              // @ts-ignore
              window.AppleID.auth.init({
                clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
                scope: "name email",
                redirectURI:
                  typeof window !== "undefined" ? window.location.origin : "",
                usePopup: true,
              });
            }
          }}
        />
      )}

      {/* Social Login Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-white/70">Or</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {/* Google Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={socialLoading !== null}
          className="w-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white flex items-center justify-center gap-3"
        >
          {socialLoading === "google" ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          ) : (
            <>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium">Continue with Google</span>
            </>
          )}
        </Button>

        {/* Facebook Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleFacebookLogin}
          disabled={socialLoading !== null}
          className="w-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white flex items-center justify-center gap-3"
        >
          {socialLoading === "facebook" ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          ) : (
            <>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="font-medium">Continue with Facebook</span>
            </>
          )}
        </Button>

        {/* Apple Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleAppleLogin}
          disabled={socialLoading !== null}
          className="w-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white flex items-center justify-center gap-3"
        >
          {socialLoading === "apple" ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          ) : (
            <>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              <span className="font-medium">Continue with Apple</span>
            </>
          )}
        </Button>
      </div>
    </>
  );
}
