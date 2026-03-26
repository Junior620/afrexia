# Bugfix Requirements Document

## Introduction

Vercel deployment is failing during the npm install phase due to a peer dependency conflict. The conflict occurs because `@vercel/speed-insights@1.3.1` has a transitive dependency chain requiring `vite@^8.0.0`, while the project uses `vite@7.3.1` in devDependencies. Although local development works fine with pnpm (which handles peer dependencies more leniently), Vercel uses npm by default, which enforces stricter peer dependency resolution and causes the build to fail with an ERESOLVE error before the build process can even start.

This bugfix addresses the deployment failure by configuring npm to handle the peer dependency conflict gracefully, allowing the Vercel deployment to proceed successfully.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN Vercel attempts to deploy the application THEN npm install fails with an ERESOLVE error due to peer dependency conflicts

1.2 WHEN npm tries to resolve dependencies during Vercel deployment THEN the installation process terminates before the build can start

1.3 WHEN the dependency conflict occurs THEN the deployment fails completely and the application cannot be deployed to production

### Expected Behavior (Correct)

2.1 WHEN Vercel attempts to deploy the application THEN npm install SHALL complete successfully despite peer dependency conflicts

2.2 WHEN npm encounters peer dependency conflicts during deployment THEN the installation process SHALL continue using legacy peer dependency resolution

2.3 WHEN the deployment process completes THEN the application SHALL build and deploy successfully to Vercel

### Unchanged Behavior (Regression Prevention)

3.1 WHEN developing locally with pnpm THEN the development environment SHALL CONTINUE TO function normally

3.2 WHEN the application builds successfully THEN the runtime behavior and functionality SHALL CONTINUE TO work as expected

3.3 WHEN dependencies are installed locally THEN pnpm's dependency resolution SHALL CONTINUE TO work without modification

3.4 WHEN the application runs in production THEN all features and integrations SHALL CONTINUE TO operate correctly

## Bug Condition Derivation

### Bug Condition Function

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type DeploymentContext
  OUTPUT: boolean
  
  // Returns true when the bug condition is met
  RETURN (X.platform = "Vercel") AND 
         (X.packageManager = "npm") AND
         (hasPeerDependencyConflict(X.dependencies))
END FUNCTION
```

Where `hasPeerDependencyConflict` is defined as:
```pascal
FUNCTION hasPeerDependencyConflict(deps)
  RETURN exists("@vercel/speed-insights@1.3.1" in deps) AND
         exists("vite@7.3.1" in deps.devDependencies) AND
         requires("vite@^8.0.0" in transitiveDependencies("@vercel/speed-insights"))
END FUNCTION
```

### Property Specification

```pascal
// Property: Fix Checking - Deployment Success
FOR ALL X WHERE isBugCondition(X) DO
  result ← deploy'(X)
  ASSERT result.npmInstall = "SUCCESS" AND
         result.build = "SUCCESS" AND
         result.deployment = "SUCCESS"
END FOR
```

### Preservation Goal

```pascal
// Property: Preservation Checking - Local Development & Runtime
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT deploy(X) = deploy'(X)
END FOR
```

This ensures that:
- Local development with pnpm continues to work identically
- Application runtime behavior remains unchanged
- Non-Vercel deployments (if any) are unaffected
- All existing functionality is preserved

### Counterexample

**Concrete example demonstrating the bug:**

```
Context: Vercel deployment of main branch
Package Manager: npm (Vercel default)
Dependencies:
  - @vercel/speed-insights@1.3.1 (requires vite@^8.0.0 transitively)
  - vite@7.3.1 (devDependencies)

Result: ERESOLVE error, deployment fails at npm install phase
```

**Expected after fix:**

```
Context: Vercel deployment of main branch
Package Manager: npm with legacy-peer-deps=true
Dependencies: (same as above)

Result: npm install succeeds, build completes, deployment successful
```
