{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
    devshell.url = "github:numtide/devshell";
  };

  outputs = { self, nixpkgs, flake-utils, devshell, ... }:
    flake-utils.lib.eachDefaultSystem (system: {
      apps.devshell = self.outputs.devShell.${system}.flakeApp;
      formatter = nixpkgs.legacyPackages.${system}.nixpkgs-fmt;
      devShell =
        let
          pkgs = import nixpkgs {
            inherit system;
            overlays = [ devshell.overlay ];
          };
          customNodejs = pkgs.nodejs-_x.override {
            openssl = pkgs.openssl_1_1;
          };
          bunV1 = pkgs.bun.overrideAttrs (final: prev: with pkgs; prev // rec {
            version = "1.1.26";
            src = passthru.sources.${stdenvNoCC.hostPlatform.system} or (throw "Unsupported system: ${stdenvNoCC.hostPlatform.system}");
            passthru = prev.passthru // {
              sources = prev.passthru.sources // {
                "aarch64-darwin" = fetchurl {
                  url = "https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-darwin-aarch64.zip";
                  sha256 = "sha256-WATRJhepP2uwJCcuD3YOqhpgaHXIeMtJcjVUaSCZadg=";
                };
                "x86_64-darwin" = fetchurl {
                  url = "https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-darwin-x64.zip";
                  sha256 = "sha256-V3tfisj2D/seYmaRIAsVgU8NjCn3CJaXIsjE7fr76Tw=";
                };
                "aarch64-linux" = fetchurl {
                  url = "https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-linux-aarch64.zip";
                  sha256 = "sha256-Vxn2GepUR5gW+qPbaTh6JBCG35O+SoYn2s3+EXA+RiI=";
                };
                "x86_64-linux" = fetchurl {
                  url = "https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-linux-x64.zip";
                  sha256 = "sha256-qHBNhvZRTjBEmDOsMJRIz4TgiLbtuWjgVHfP+aBaqio=";
                };
              };
            };
          });
        in
        pkgs.devshell.mkShell {
          name = "astro-blog-template";
          commands = [
            {
              name = "yarn";
              package = pkgs.yarn.override {
                nodejs = bunV1;
              };
            }
            {
              name = "pnpm";
              package = pkgs.pnpm;
            }
            {
              name = "yarn2nix";
              package = pkgs.yarn2nix;
            }
            {
              name = "node";
              package = pkgs.nodejs;
            }
            {
              name = "bun";
              package = bunV1;
            }
          ];
          packages = [
            # (pkgs.writeShellScriptBin "node" ''exec -a node bun "$@"'')
            # (pkgs.writeShellScriptBin "yarn" ''exec -a yarn bun "$@"'')
            pkgs.getconf
          ];
          env = [
            {
              name = "NODE_OPTIONS";
              value = "--max-old-space-size=4096";
            }
          ];
        };
    });
}
