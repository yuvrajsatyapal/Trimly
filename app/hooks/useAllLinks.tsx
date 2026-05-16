"use client"

import type { Link as PrismaLink } from "@/lib/generated/prisma/browser";
import { getAllLink } from "@/lib/utils/getAllLinks";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useAllLink = () => {
  const { data: session } = useSession();

  return useQuery<PrismaLink[]>({
    queryKey: ["all-links"],
    queryFn: getAllLink,
    enabled: !!session,
  });
};