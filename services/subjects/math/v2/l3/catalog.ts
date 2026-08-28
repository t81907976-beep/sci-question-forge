import { ALGEBRA_EQUATION_L3_CATALOG } from "./algebra-equation.ts";
import { ALGEBRA_POLYNOMIAL_L3_CATALOG } from "./algebra-polynomial.ts";
import { ALGEBRA_INEQUALITY_L3_CATALOG } from "./algebra-inequality.ts";
import { ALGEBRA_ABSTRACT_L3_CATALOG } from "./algebra-abstract.ts";
import { ALGEBRA_LINEAR_L3_CATALOG } from "./algebra-linear.ts";
import { CATEGORY_THEORY_L3_CATALOG } from "./category-theory.ts";
import { LATTICE_THEORY_L3_CATALOG } from "./lattice-theory.ts";
import { ALGEBRAIC_GEOMETRY_CLASSICAL_L3_CATALOG } from "./algebraic-geometry-classical.ts";
import { ALGEBRAIC_GEOMETRY_SCHEMES_L3_CATALOG } from "./algebraic-geometry-schemes.ts";
import { ALGEBRAIC_GEOMETRY_CURVES_L3_CATALOG } from "./algebraic-geometry-curves.ts";
import { GEOMETRY_PLANE_L3_CATALOG } from "./geometry-plane.ts";
import { GEOMETRY_ANALYTIC_L3_CATALOG } from "./geometry-analytic.ts";
import { GEOMETRY_SOLID_L3_CATALOG } from "./geometry-solid.ts";
import { GEOMETRY_DIFFERENTIAL_L3_CATALOG } from "./geometry-differential.ts";
import { GEOMETRY_CONVEX_L3_CATALOG } from "./geometry-convex.ts";
import { PDE_ELLIPTIC_L3_CATALOG } from "./pde-elliptic.ts";
import { NUMBER_THEORY_BASIC_L3_CATALOG } from "./number-theory-basic.ts";
import { NUMBER_THEORY_DIOPHANTINE_L3_CATALOG } from "./number-theory-diophantine.ts";
import { NUMBER_THEORY_ALGEBRAIC_L3_CATALOG } from "./number-theory-algebraic.ts";
import { NUMBER_THEORY_MODULAR_L3_CATALOG } from "./number-theory-modular.ts";
import { NUMBER_THEORY_SEQUENCE_L3_CATALOG } from "./number-theory-sequence.ts";
import { NUMBER_THEORY_COMPUTATIONAL_L3_CATALOG } from "./number-theory-computational.ts";
import { NUMBER_THEORY_ANALYTIC_L3_CATALOG } from "./number-theory-analytic.ts";
import { NUMBER_THEORY_CONTINUED_FRACTION_L3_CATALOG } from "./number-theory-continued-fraction.ts";
import { NUMBER_THEORY_TRANSCENDENTAL_L3_CATALOG } from "./number-theory-transcendental.ts";
import { PROBABILITY_BASIC_L3_CATALOG } from "./probability-basic.ts";
import { PROBABILITY_STATISTICS_L3_CATALOG } from "./probability-statistics.ts";
import { PROBABILITY_STOCHASTIC_L3_CATALOG } from "./probability-stochastic.ts";
import { PROBABILITY_MARKOV_L3_CATALOG } from "./probability-markov.ts";
import { PROBABILITY_LIMIT_L3_CATALOG } from "./probability-limit.ts";
import { CALCULUS_LIMIT_L3_CATALOG } from "./calculus-limit.ts";
import { CALCULUS_DERIVATIVE_L3_CATALOG } from "./calculus-derivative.ts";
import { CALCULUS_INTEGRAL_L3_CATALOG } from "./calculus-integral.ts";
import { COMPLEX_ANALYSIS_L3_CATALOG } from "./complex-analysis.ts";
import { COMPLEX_GEOMETRY_L3_CATALOG } from "./complex-geometry.ts";
import { TOPOLOGY_POINTSET_L3_CATALOG } from "./topology-pointset.ts";
import { TOPOLOGY_ALGEBRAIC_L3_CATALOG } from "./topology-algebraic.ts";
import { FUNCTIONAL_BANACH_L3_CATALOG } from "./functional-banach.ts";
import { FUNCTIONAL_OPERATOR_L3_CATALOG } from "./functional-operator.ts";
import { FUNCTIONAL_SPECTRAL_L3_CATALOG } from "./functional-spectral.ts";
import { PDE_HYPERBOLIC_L3_CATALOG } from "./pde-hyperbolic.ts";
import { PDE_PARABOLIC_L3_CATALOG } from "./pde-parabolic.ts";
import { PDE_DISTRIBUTION_L3_CATALOG } from "./pde-distribution.ts";
import { ODE_QUALITATIVE_L3_CATALOG } from "./ode-qualitative.ts";
import { ODE_BOUNDARY_VALUE_L3_CATALOG } from "./ode-boundary-value.ts";
import { ODE_PERTURBATION_L3_CATALOG } from "./ode-perturbation.ts";
import { DYNAMICAL_CHAOS_L3_CATALOG } from "./dynamical-chaos.ts";
import { DYNAMICAL_ERGODIC_L3_CATALOG } from "./dynamical-ergodic.ts";
import { DYNAMICAL_HAMILTONIAN_L3_CATALOG } from "./dynamical-hamiltonian.ts";
import { NUMERICAL_LINEAR_L3_CATALOG } from "./numerical-linear.ts";
import { NUMERICAL_APPROXIMATION_L3_CATALOG } from "./numerical-approximation.ts";
import { NUMERICAL_ODE_L3_CATALOG } from "./numerical-ode.ts";
import { NUMERICAL_PDE_L3_CATALOG } from "./numerical-pde.ts";
import { OPTIMIZATION_LINEAR_L3_CATALOG } from "./optimization-linear.ts";
import { OPTIMIZATION_NONLINEAR_L3_CATALOG } from "./optimization-nonlinear.ts";
import { INFORMATION_CODING_L3_CATALOG } from "./information-coding.ts";
import { SPECIAL_FUNCTIONS_L3_CATALOG } from "./special-functions.ts";
import { COMBINATORICS_BASIC_L3_CATALOG } from "./combinatorics-basic.ts";
import { COMBINATORICS_GRAPH_L3_CATALOG } from "./combinatorics-graph.ts";
import { COMBINATORICS_EXTREMAL_L3_CATALOG } from "./combinatorics-extremal.ts";
import { COMBINATORICS_PROBABILISTIC_L3_CATALOG } from "./combinatorics-probabilistic.ts";
import { COMBINATORICS_ALGEBRAIC_L3_CATALOG } from "./combinatorics-algebraic.ts";
import { COMBINATORICS_ADDITIVE_L3_CATALOG } from "./combinatorics-additive.ts";
import { COMBINATORICS_DESIGN_L3_CATALOG } from "./combinatorics-design.ts";
import { COMBINATORICS_CODING_L3_CATALOG } from "./combinatorics-coding.ts";
import { COMBINATORICS_GEOMETRY_L3_CATALOG } from "./combinatorics-geometry.ts";
import type { MathV2L3Node, MathV2L3RoutingEvidence } from "./types.ts";

// 各 L2 文件分别维护自己的 L3 目录；这里仅负责汇总和统一路由。
export const MATH_V2_L3_CATALOG: Record<string, MathV2L3Node> = Object.freeze({
    ...ALGEBRA_EQUATION_L3_CATALOG,
    ...ALGEBRA_POLYNOMIAL_L3_CATALOG,
    ...ALGEBRA_INEQUALITY_L3_CATALOG,
    ...ALGEBRA_ABSTRACT_L3_CATALOG,
    ...ALGEBRA_LINEAR_L3_CATALOG,
    ...CATEGORY_THEORY_L3_CATALOG,
    ...LATTICE_THEORY_L3_CATALOG,
    ...ALGEBRAIC_GEOMETRY_CLASSICAL_L3_CATALOG,
    ...ALGEBRAIC_GEOMETRY_SCHEMES_L3_CATALOG,
    ...ALGEBRAIC_GEOMETRY_CURVES_L3_CATALOG,
    ...GEOMETRY_PLANE_L3_CATALOG,
    ...GEOMETRY_ANALYTIC_L3_CATALOG,
    ...GEOMETRY_SOLID_L3_CATALOG,
    ...GEOMETRY_DIFFERENTIAL_L3_CATALOG,
    ...GEOMETRY_CONVEX_L3_CATALOG,
    ...PDE_ELLIPTIC_L3_CATALOG,
    ...NUMBER_THEORY_BASIC_L3_CATALOG,
    ...NUMBER_THEORY_DIOPHANTINE_L3_CATALOG,
    ...NUMBER_THEORY_ALGEBRAIC_L3_CATALOG,
    ...NUMBER_THEORY_MODULAR_L3_CATALOG,
    ...NUMBER_THEORY_SEQUENCE_L3_CATALOG,
    ...NUMBER_THEORY_COMPUTATIONAL_L3_CATALOG,
    ...NUMBER_THEORY_ANALYTIC_L3_CATALOG,
    ...NUMBER_THEORY_CONTINUED_FRACTION_L3_CATALOG,
    ...NUMBER_THEORY_TRANSCENDENTAL_L3_CATALOG,
    ...PROBABILITY_BASIC_L3_CATALOG,
    ...PROBABILITY_STATISTICS_L3_CATALOG,
    ...PROBABILITY_STOCHASTIC_L3_CATALOG,
    ...PROBABILITY_MARKOV_L3_CATALOG,
    ...PROBABILITY_LIMIT_L3_CATALOG,
    ...CALCULUS_LIMIT_L3_CATALOG,
    ...CALCULUS_DERIVATIVE_L3_CATALOG,
    ...CALCULUS_INTEGRAL_L3_CATALOG,
    ...COMPLEX_ANALYSIS_L3_CATALOG,
    ...COMPLEX_GEOMETRY_L3_CATALOG,
    ...TOPOLOGY_POINTSET_L3_CATALOG,
    ...TOPOLOGY_ALGEBRAIC_L3_CATALOG,
    ...FUNCTIONAL_BANACH_L3_CATALOG,
    ...FUNCTIONAL_OPERATOR_L3_CATALOG,
    ...FUNCTIONAL_SPECTRAL_L3_CATALOG,
    ...PDE_HYPERBOLIC_L3_CATALOG,
    ...PDE_PARABOLIC_L3_CATALOG,
    ...PDE_DISTRIBUTION_L3_CATALOG,
    ...ODE_QUALITATIVE_L3_CATALOG,
    ...ODE_BOUNDARY_VALUE_L3_CATALOG,
    ...ODE_PERTURBATION_L3_CATALOG,
    ...DYNAMICAL_CHAOS_L3_CATALOG,
    ...DYNAMICAL_ERGODIC_L3_CATALOG,
    ...DYNAMICAL_HAMILTONIAN_L3_CATALOG,
    ...NUMERICAL_LINEAR_L3_CATALOG,
    ...NUMERICAL_APPROXIMATION_L3_CATALOG,
    ...NUMERICAL_ODE_L3_CATALOG,
    ...NUMERICAL_PDE_L3_CATALOG,
    ...OPTIMIZATION_LINEAR_L3_CATALOG,
    ...OPTIMIZATION_NONLINEAR_L3_CATALOG,
    ...INFORMATION_CODING_L3_CATALOG,
    ...SPECIAL_FUNCTIONS_L3_CATALOG,
    ...COMBINATORICS_BASIC_L3_CATALOG,
    ...COMBINATORICS_GRAPH_L3_CATALOG,
    ...COMBINATORICS_EXTREMAL_L3_CATALOG,
    ...COMBINATORICS_PROBABILISTIC_L3_CATALOG,
    ...COMBINATORICS_ALGEBRAIC_L3_CATALOG,
    ...COMBINATORICS_ADDITIVE_L3_CATALOG,
    ...COMBINATORICS_DESIGN_L3_CATALOG,
    ...COMBINATORICS_CODING_L3_CATALOG,
    ...COMBINATORICS_GEOMETRY_L3_CATALOG,
});

export function getMathV2L3Knowledge(id: string): MathV2L3Node {
    const node = MATH_V2_L3_CATALOG[id];
    if (!node) throw new Error(`Unknown math V2 L3 knowledge item: ${id}`);
    return node;
}

export function identifyMathV2L3KnowledgeWithEvidence(topic: string): MathV2L3RoutingEvidence | null {
    const text = String(topic || "").trim();
    if (!text) return null;

    const exactKey = MATH_V2_L3_CATALOG[text];
    if (exactKey) {
        return {
            l3Key: exactKey.id,
            l2Key: exactKey.l2Key,
            l3Name: exactKey.name,
            matchMethod: "exact_key",
            matchedAlias: text,
        };
    }

    const exactName = Object.values(MATH_V2_L3_CATALOG)
        .find(node => node.name.toLowerCase() === text.toLowerCase());
    if (exactName) {
        return {
            l3Key: exactName.id,
            l2Key: exactName.l2Key,
            l3Name: exactName.name,
            matchMethod: "exact_name",
            matchedAlias: exactName.name,
        };
    }

    const aliasMatch = Object.values(MATH_V2_L3_CATALOG)
        .flatMap(node => node.aliases.map(alias => ({ node, alias })))
        .find(item => item.alias.toLowerCase() === text.toLowerCase());
    if (!aliasMatch) return null;

    return {
        l3Key: aliasMatch.node.id,
        l2Key: aliasMatch.node.l2Key,
        l3Name: aliasMatch.node.name,
        matchMethod: "alias",
        matchedAlias: aliasMatch.alias,
    };
}
