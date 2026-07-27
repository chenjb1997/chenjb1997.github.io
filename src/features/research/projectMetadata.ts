import type {
  VaultGroup,
  VaultProject,
  VaultProjectStage,
} from "./types";

export const projectStageOptions: Array<{
  value: VaultProjectStage;
  label: string;
}> = [
  { value: "submitted", label: "已提交" },
  { value: "pending", label: "待提交" },
  { value: "planned", label: "计划中" },
];

const projectStageLabels: Record<VaultProjectStage, string> = {
  submitted: "已提交",
  pending: "待提交",
  planned: "计划中",
};

const venuePattern =
  /\b(SODA|ICLR|NeurIPS|ICML|ICALP|ESA|ITCS|PODS|ICDT|MFCS|STACS|TKDE|ICDE|WWW|ISAAC)\b/i;

const venuePendingPattern = /^(?:待定|未定|暂无|无|none|tbd|n\/?a)$/i;

const isVaultProjectStage = (value: unknown): value is VaultProjectStage =>
  value === "submitted" || value === "pending" || value === "planned";

const getSpecialGroupStage = (
  group: VaultGroup,
): VaultProjectStage | null => {
  if (group.id === "submitted" || /已提交|已投稿/.test(group.title)) {
    return "submitted";
  }

  if (group.id === "planned" || /计划中/.test(group.title)) {
    return "planned";
  }

  return null;
};

export const getProjectStage = (
  project: VaultProject,
  group: VaultGroup,
): VaultProjectStage => {
  if (isVaultProjectStage(project.stage)) {
    return project.stage;
  }

  const groupStage = getSpecialGroupStage(group);
  if (groupStage) {
    return groupStage;
  }

  // 对无法识别的旧分组保留原来的文字兼容；明确的研究线仍以待提交为默认。
  if (/已提交|已投稿/.test(project.status)) {
    return "submitted";
  }
  if (/待提交/.test(project.status)) {
    return "pending";
  }

  // 旧数据里“计划中”本来就是一个单独分组。移出该分组后的研究线
  // 默认属于待提交；新数据可以通过 project.stage 明确覆盖这个默认值。
  return "pending";
};

export const getProjectStageLabel = (stage: VaultProjectStage) =>
  projectStageLabels[stage];

export const getProjectStatusTag = (
  project: VaultProject,
  group: VaultGroup,
) => {
  const id = getProjectStage(project, group);
  return { id, label: getProjectStageLabel(id) };
};

export const getProjectStageAfterMove = (
  project: VaultProject,
  sourceGroup: VaultGroup,
  destinationGroup: VaultGroup,
): VaultProjectStage => {
  const destinationStage = getSpecialGroupStage(destinationGroup);
  if (destinationStage) {
    return destinationStage;
  }

  if (getSpecialGroupStage(sourceGroup)) {
    return "pending";
  }

  return getProjectStage(project, sourceGroup);
};

export const getNewProjectStage = (group: VaultGroup): VaultProjectStage =>
  getSpecialGroupStage(group) ?? "pending";

export const getProjectVenueLabel = (
  project: VaultProject,
  group: VaultGroup,
): string | null => {
  if (project.venue === null) {
    return null;
  }

  const explicitVenue = project.venue?.trim();
  if (explicitVenue) {
    return venuePendingPattern.test(explicitVenue) ? null : explicitVenue;
  }

  const inferredVenue = `${project.route} ${project.status}`.match(venuePattern)?.[1];
  if (inferredVenue) {
    return inferredVenue.toUpperCase();
  }

  const groupVenue = group.title.match(venuePattern)?.[1];
  return groupVenue ? groupVenue.toUpperCase() : null;
};
