import { virtualFileSystem, type VFSNode } from "@/data/vfs";

export function normalizePath(path: string): string {
  if (!path || path === "/") {
    return "/";
  }

  const parts = path.split("/").filter(Boolean);

  return `/${parts.join("/")}`;
}

export function getPathParts(path: string): string[] {
  return normalizePath(path).split("/").filter(Boolean);
}

export function getNodeByPath(path: string): VFSNode | null {
  const parts = getPathParts(path);

  let currentNode: VFSNode = virtualFileSystem;

  if (parts.length === 0) {
    return currentNode;
  }

  for (const part of parts) {
    const nextNode = currentNode.children?.find(
      (child) => child.name.toLowerCase() === part.toLowerCase()
    );

    if (!nextNode) {
      return null;
    }

    currentNode = nextNode;
  }

  return currentNode;
}

export function joinPath(basePath: string, childName: string): string {
  const normalizedBase = normalizePath(basePath);

  if (normalizedBase === "/") {
    return `/${childName}`;
  }

  return `${normalizedBase}/${childName}`;
}

export function getParentPath(path: string): string {
  const parts = getPathParts(path);

  if (parts.length <= 1) {
    return "/";
  }

  return `/${parts.slice(0, -1).join("/")}`;
}

export function resolvePath(currentPath: string, inputPath: string): string {
  if (!inputPath || inputPath === "~") {
    return "/home/user";
  }

  if (inputPath.startsWith("/")) {
    return normalizePath(inputPath);
  }

  const currentParts = getPathParts(currentPath);
  const inputParts = inputPath.split("/").filter(Boolean);

  for (const part of inputParts) {
    if (part === ".") {
      continue;
    }

    if (part === "..") {
      currentParts.pop();
      continue;
    }

    currentParts.push(part);
  }

  return normalizePath(`/${currentParts.join("/")}`);
}

export function getBreadcrumbs(path: string) {
  const parts = getPathParts(path);

  const breadcrumbs = [
    {
      label: "root",
      path: "/",
    },
  ];

  parts.forEach((part, index) => {
    breadcrumbs.push({
      label: part,
      path: `/${parts.slice(0, index + 1).join("/")}`,
    });
  });

  return breadcrumbs;
}
