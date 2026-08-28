import { ALGEBRA_EQUATION_L3_RULES } from "./algebra-equation.ts";
import { ALGEBRA_POLYNOMIAL_L3_RULES } from "./algebra-polynomial.ts";
import { ALGEBRA_INEQUALITY_L3_RULES } from "./algebra-inequality.ts";
import { ALGEBRA_ABSTRACT_L3_RULES } from "./algebra-abstract.ts";
import { ALGEBRA_LINEAR_L3_RULES } from "./algebra-linear.ts";
import { CATEGORY_THEORY_L3_RULES } from "./category-theory.ts";
import { LATTICE_THEORY_L3_RULES } from "./lattice-theory.ts";
import { ALGEBRAIC_GEOMETRY_CLASSICAL_L3_RULES } from "./algebraic-geometry-classical.ts";
import { ALGEBRAIC_GEOMETRY_SCHEMES_L3_RULES } from "./algebraic-geometry-schemes.ts";
import { ALGEBRAIC_GEOMETRY_CURVES_L3_RULES } from "./algebraic-geometry-curves.ts";
import { GEOMETRY_PLANE_L3_RULES } from "./geometry-plane.ts";
import { GEOMETRY_ANALYTIC_L3_RULES } from "./geometry-analytic.ts";
import { GEOMETRY_SOLID_L3_RULES } from "./geometry-solid.ts";
import { GEOMETRY_DIFFERENTIAL_L3_RULES } from "./geometry-differential.ts";
import { GEOMETRY_CONVEX_L3_RULES } from "./geometry-convex.ts";
import { PDE_ELLIPTIC_L3_RULES } from "./pde-elliptic.ts";
import { NUMBER_THEORY_BASIC_L3_RULES } from "./number-theory-basic.ts";
import { NUMBER_THEORY_DIOPHANTINE_L3_RULES } from "./number-theory-diophantine.ts";
import { NUMBER_THEORY_ALGEBRAIC_L3_RULES } from "./number-theory-algebraic.ts";
import { NUMBER_THEORY_MODULAR_L3_RULES } from "./number-theory-modular.ts";
import { NUMBER_THEORY_SEQUENCE_L3_RULES } from "./number-theory-sequence.ts";
import { NUMBER_THEORY_COMPUTATIONAL_L3_RULES } from "./number-theory-computational.ts";
import { NUMBER_THEORY_ANALYTIC_L3_RULES } from "./number-theory-analytic.ts";
import { NUMBER_THEORY_CONTINUED_FRACTION_L3_RULES } from "./number-theory-continued-fraction.ts";
import { NUMBER_THEORY_TRANSCENDENTAL_L3_RULES } from "./number-theory-transcendental.ts";
import { PROBABILITY_BASIC_L3_RULES } from "./probability-basic.ts";
import { PROBABILITY_STATISTICS_L3_RULES } from "./probability-statistics.ts";
import { PROBABILITY_STOCHASTIC_L3_RULES } from "./probability-stochastic.ts";
import { PROBABILITY_MARKOV_L3_RULES } from "./probability-markov.ts";
import { PROBABILITY_LIMIT_L3_RULES } from "./probability-limit.ts";
import { CALCULUS_LIMIT_L3_RULES } from "./calculus-limit.ts";
import { CALCULUS_DERIVATIVE_L3_RULES } from "./calculus-derivative.ts";
import { CALCULUS_INTEGRAL_L3_RULES } from "./calculus-integral.ts";
import { COMPLEX_ANALYSIS_L3_RULES } from "./complex-analysis.ts";
import { COMPLEX_GEOMETRY_L3_RULES } from "./complex-geometry.ts";
import { TOPOLOGY_POINTSET_L3_RULES } from "./topology-pointset.ts";
import { TOPOLOGY_ALGEBRAIC_L3_RULES } from "./topology-algebraic.ts";
import { FUNCTIONAL_BANACH_L3_RULES } from "./functional-banach.ts";
import { FUNCTIONAL_OPERATOR_L3_RULES } from "./functional-operator.ts";
import { FUNCTIONAL_SPECTRAL_L3_RULES } from "./functional-spectral.ts";
import { PDE_HYPERBOLIC_L3_RULES } from "./pde-hyperbolic.ts";
import { PDE_PARABOLIC_L3_RULES } from "./pde-parabolic.ts";
import { PDE_DISTRIBUTION_L3_RULES } from "./pde-distribution.ts";
import { ODE_QUALITATIVE_L3_RULES } from "./ode-qualitative.ts";
import { ODE_BOUNDARY_VALUE_L3_RULES } from "./ode-boundary-value.ts";
import { ODE_PERTURBATION_L3_RULES } from "./ode-perturbation.ts";
import { DYNAMICAL_CHAOS_L3_RULES } from "./dynamical-chaos.ts";
import { DYNAMICAL_ERGODIC_L3_RULES } from "./dynamical-ergodic.ts";
import { DYNAMICAL_HAMILTONIAN_L3_RULES } from "./dynamical-hamiltonian.ts";
import { NUMERICAL_LINEAR_L3_RULES } from "./numerical-linear.ts";
import { NUMERICAL_APPROXIMATION_L3_RULES } from "./numerical-approximation.ts";
import { NUMERICAL_ODE_L3_RULES } from "./numerical-ode.ts";
import { NUMERICAL_PDE_L3_RULES } from "./numerical-pde.ts";
import { OPTIMIZATION_LINEAR_L3_RULES } from "./optimization-linear.ts";
import { OPTIMIZATION_NONLINEAR_L3_RULES } from "./optimization-nonlinear.ts";
import { INFORMATION_CODING_L3_RULES } from "./information-coding.ts";
import { SPECIAL_FUNCTIONS_L3_RULES } from "./special-functions.ts";
import { COMBINATORICS_BASIC_L3_RULES } from "./combinatorics-basic.ts";
import { COMBINATORICS_GRAPH_L3_RULES } from "./combinatorics-graph.ts";
import { COMBINATORICS_EXTREMAL_L3_RULES } from "./combinatorics-extremal.ts";
import { COMBINATORICS_PROBABILISTIC_L3_RULES } from "./combinatorics-probabilistic.ts";
import { COMBINATORICS_ALGEBRAIC_L3_RULES } from "./combinatorics-algebraic.ts";
import { COMBINATORICS_ADDITIVE_L3_RULES } from "./combinatorics-additive.ts";
import { COMBINATORICS_DESIGN_L3_RULES } from "./combinatorics-design.ts";
import { COMBINATORICS_CODING_L3_RULES } from "./combinatorics-coding.ts";
import { COMBINATORICS_GEOMETRY_L3_RULES } from "./combinatorics-geometry.ts";
import {
    MATH_V2_L3_CATALOG,
    getMathV2L3Knowledge,
    identifyMathV2L3KnowledgeWithEvidence,
} from "./catalog.ts";
import type { MathV2L3Rules } from "./types.ts";

// 对外唯一入口：调用方不需要知道具体 L2 规则文件的组织方式。
export {
    MATH_V2_L3_CATALOG,
    getMathV2L3Knowledge,
    identifyMathV2L3KnowledgeWithEvidence,
};
export type * from "./types.ts";

const MATH_V2_L3_RULES: Record<string, MathV2L3Rules> = Object.freeze({
    ...ALGEBRA_EQUATION_L3_RULES,
    ...ALGEBRA_POLYNOMIAL_L3_RULES,
    ...ALGEBRA_INEQUALITY_L3_RULES,
    ...ALGEBRA_ABSTRACT_L3_RULES,
    ...ALGEBRA_LINEAR_L3_RULES,
    ...CATEGORY_THEORY_L3_RULES,
    ...LATTICE_THEORY_L3_RULES,
    ...ALGEBRAIC_GEOMETRY_CLASSICAL_L3_RULES,
    ...ALGEBRAIC_GEOMETRY_SCHEMES_L3_RULES,
    ...ALGEBRAIC_GEOMETRY_CURVES_L3_RULES,
    ...GEOMETRY_PLANE_L3_RULES,
    ...GEOMETRY_ANALYTIC_L3_RULES,
    ...GEOMETRY_SOLID_L3_RULES,
    ...GEOMETRY_DIFFERENTIAL_L3_RULES,
    ...GEOMETRY_CONVEX_L3_RULES,
    ...PDE_ELLIPTIC_L3_RULES,
    ...NUMBER_THEORY_BASIC_L3_RULES,
    ...NUMBER_THEORY_DIOPHANTINE_L3_RULES,
    ...NUMBER_THEORY_ALGEBRAIC_L3_RULES,
    ...NUMBER_THEORY_MODULAR_L3_RULES,
    ...NUMBER_THEORY_SEQUENCE_L3_RULES,
    ...NUMBER_THEORY_COMPUTATIONAL_L3_RULES,
    ...NUMBER_THEORY_ANALYTIC_L3_RULES,
    ...NUMBER_THEORY_CONTINUED_FRACTION_L3_RULES,
    ...NUMBER_THEORY_TRANSCENDENTAL_L3_RULES,
    ...PROBABILITY_BASIC_L3_RULES,
    ...PROBABILITY_STATISTICS_L3_RULES,
    ...PROBABILITY_STOCHASTIC_L3_RULES,
    ...PROBABILITY_MARKOV_L3_RULES,
    ...PROBABILITY_LIMIT_L3_RULES,
    ...CALCULUS_LIMIT_L3_RULES,
    ...CALCULUS_DERIVATIVE_L3_RULES,
    ...CALCULUS_INTEGRAL_L3_RULES,
    ...COMPLEX_ANALYSIS_L3_RULES,
    ...COMPLEX_GEOMETRY_L3_RULES,
    ...TOPOLOGY_POINTSET_L3_RULES,
    ...TOPOLOGY_ALGEBRAIC_L3_RULES,
    ...FUNCTIONAL_BANACH_L3_RULES,
    ...FUNCTIONAL_OPERATOR_L3_RULES,
    ...FUNCTIONAL_SPECTRAL_L3_RULES,
    ...PDE_HYPERBOLIC_L3_RULES,
    ...PDE_PARABOLIC_L3_RULES,
    ...PDE_DISTRIBUTION_L3_RULES,
    ...ODE_QUALITATIVE_L3_RULES,
    ...ODE_BOUNDARY_VALUE_L3_RULES,
    ...ODE_PERTURBATION_L3_RULES,
    ...DYNAMICAL_CHAOS_L3_RULES,
    ...DYNAMICAL_ERGODIC_L3_RULES,
    ...DYNAMICAL_HAMILTONIAN_L3_RULES,
    ...NUMERICAL_LINEAR_L3_RULES,
    ...NUMERICAL_APPROXIMATION_L3_RULES,
    ...NUMERICAL_ODE_L3_RULES,
    ...NUMERICAL_PDE_L3_RULES,
    ...OPTIMIZATION_LINEAR_L3_RULES,
    ...OPTIMIZATION_NONLINEAR_L3_RULES,
    ...INFORMATION_CODING_L3_RULES,
    ...SPECIAL_FUNCTIONS_L3_RULES,
    ...COMBINATORICS_BASIC_L3_RULES,
    ...COMBINATORICS_GRAPH_L3_RULES,
    ...COMBINATORICS_EXTREMAL_L3_RULES,
    ...COMBINATORICS_PROBABILISTIC_L3_RULES,
    ...COMBINATORICS_ALGEBRAIC_L3_RULES,
    ...COMBINATORICS_ADDITIVE_L3_RULES,
    ...COMBINATORICS_DESIGN_L3_RULES,
    ...COMBINATORICS_CODING_L3_RULES,
    ...COMBINATORICS_GEOMETRY_L3_RULES,
});

export function getMathV2L3Rules(id: string): MathV2L3Rules {
    const rules = MATH_V2_L3_RULES[id];
    if (!rules) throw new Error(`Missing math V2 L3 rules: ${id}`);
    return rules;
}

export { MATH_V2_L3_RULES };
