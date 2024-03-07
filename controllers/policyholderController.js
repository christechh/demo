const Policyholder = require("../models/policyholder");

async function getPolicyholder(ctx) {
  const code = ctx.query.code;
  const level = ctx.query.level;
  try {
    const policyholder = await Policyholder.getPolicyholder(code);

    if (!policyholder) {
      ctx.status = 404;
      ctx.body = { error: "Policyholder not found" };
      return;
    }

    policyholder.isMainNode = true;

    const introductionRelationship = await getIntroductionRelationship(
      policyholder,
      level,
      true
    );

    ctx.body = introductionRelationship;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
}

async function getIntroductionRelationship(
  policyholder,
  level,
  isMainNode = false,
  isLeftNode = false
) {
  if (level === 0) {
    return [];
  }

  const directIntroductions = await Policyholder.find({
    introducer_code: policyholder.code,
  });

  const subRelationships = await Promise.all(
    directIntroductions.map(async (directIntroduction, index) => {
      const isLeft = index === 0;
      const childLevel = level - 1;
      return {
        code: directIntroduction.code,
        name: directIntroduction.name,
        registration_date: directIntroduction.registration_date,
        introducer_code: directIntroduction.introducer_code,
        isMainNode: false,
        isDirectIntroduction: true,
        isLeftNode: isLeft,
        relationship: await getIntroductionRelationship(
          directIntroduction,
          childLevel,
          false,
          isLeft
        ),
      };
    })
  );

  if (isMainNode) {
    return [
      {
        code: policyholder.code,
        name: policyholder.name,
        registration_date: policyholder.registration_date,
        introducer_code: policyholder.introducer_code,
        isMainNode,
        isDirectIntroduction: false,
        isLeftNode,
        relationship: subRelationships,
      },
    ];
  }

  return subRelationships;
}



async function getTopPolicyholders(ctx) {
  const code = ctx.params.code;
  try {
    const topPolicyholders = await Policyholder.getTopPolicyholders(code);
    ctx.body = topPolicyholders;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
}

module.exports = {
  getPolicyholder,
  getTopPolicyholders,
};
