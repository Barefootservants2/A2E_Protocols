# FORGE v2.0 TEST HARNESS SPECIFICATION

**Version:** 1.0  
**Owner:** Ashes2Echoes, LLC  
**Principal:** William Earl Lemon — ABSOLUTE  
**Created:** January 22, 2026

---

## OVERVIEW

Test harness for validating FORGE v2.0 prompt engineering system against the F:\FORGE_TEST_SUITE benchmark (31 repos, 500K+ questions). Integrates with EleutherAI's lm-evaluation-harness for standardized benchmarking.

---

## TEST SUITE INVENTORY

### Primary Repositories (F:\FORGE_TEST_SUITE)

| Category | Repository | Questions | Purpose |
|----------|------------|-----------|---------|
| **Finance** | bigbench-trading | ~50K | Trading scenarios, market analysis |
| **Finance** | mmlu-finance | ~15K | Professional finance knowledge |
| **Legal** | legalbench | ~25K | Legal reasoning, case analysis |
| **Legal** | bar-exam-questions | ~10K | Bar exam preparation |
| **Medical** | medqa | ~60K | Medical diagnosis, treatment |
| **Medical** | pubmedqa | ~40K | Biomedical literature |
| **Physics** | scienceqa-physics | ~20K | Physics problem solving |
| **Quantum** | quantum-computing-benchmarks | ~5K | Quantum mechanics |
| **Coding** | humaneval | ~164 | Code generation |
| **Coding** | mbpp | ~974 | Python programming |
| **Reasoning** | arc-challenge | ~2.5K | Abstract reasoning |
| **Reasoning** | hellaswag | ~10K | Commonsense reasoning |
| **Math** | gsm8k | ~8K | Grade school math |
| **Math** | math-hard | ~5K | Competition math |
| **General** | mmlu | ~15K | Multi-domain knowledge |
| **General** | truthfulqa | ~817 | Factual accuracy |

**Total Available:** ~500K+ question samples

---

## VALIDATION METHODOLOGY

### Phase 1: Baseline Establishment

1. Run raw model (no FORGE prompt) against 1000 samples per category
2. Record accuracy, confidence, response quality
3. Establish baseline metrics

### Phase 2: FORGE-Enhanced Testing

1. Generate FORGE v2.0 prompt for each category
2. Inject FORGE prompt into lm-eval task config
3. Run same 1000 samples with FORGE enhancement
4. Record metrics

### Phase 3: Delta Analysis

```
FORGE_DELTA = (FORGE_SCORE - BASELINE_SCORE) / BASELINE_SCORE × 100

TARGET: FORGE_DELTA ≥ +10% across all categories
MINIMUM: FORGE_DELTA ≥ +5% (any category below = FAIL)
```

---

## LM-EVAL-HARNESS INTEGRATION

### Custom Task Configuration

```yaml
# forge_finance_task.yaml
task: forge_finance_benchmark
dataset_path: local
dataset_name: finance_qa
output_type: generate_until
test_split: test
doc_to_text: "{{forge_prompt}}\n\nQuestion: {{question}}\nAnswer:"
doc_to_target: "{{answer}}"
metric_list:
  - metric: exact_match
  - metric: f1
  - metric: rouge1
```

### Execution Commands

```bash
# Run FORGE finance benchmark
lm_eval --model anthropic \
        --model_args model=claude-sonnet-4-20250514 \
        --tasks forge_finance_benchmark \
        --num_fewshot 0 \
        --output_path results/forge_finance/

# Run baseline comparison
lm_eval --model anthropic \
        --model_args model=claude-sonnet-4-20250514 \
        --tasks finance_qa_baseline \
        --num_fewshot 0 \
        --output_path results/baseline_finance/
```

---

## TEST CATEGORIES & FORGE TEMPLATE MAPPING

| Test Category | FORGE Template | METATRON Gates | HUNTER Modules |
|---------------|----------------|----------------|----------------|
| Insider Trading Analysis | FIN-001 | 0.5, 1, 2, 5.5, 7.5 | H1, H4 |
| Sector Momentum | FIN-002 | 0.5, 1, 5.5, 11 | H3 |
| Political Catalyst | FIN-003 | 0.5, 1, 5.5, 7.5 | H2 |
| Oversold Quality | FIN-004 | 0.5, 1, 7.5 | H5 |
| Contract Pipeline | FIN-005 | 0.5, 1, 5.5 | H6 |
| Position Sizing | FIN-006 | 0.5, 7.5 | — |
| Counter-Thesis | FIN-007 | 7.5 | — |
| Physics Thesis | ACA-001 | 0.5, 1, 2, 3 | — |
| Economics Thesis | ACA-002 | 0.5, 1, 2, 5.5 | — |
| Legal Brief | ACA-003 | 0.5, 1, 2, 3 | — |
| Medical Research | ACA-004 | 0.5, 1, 2, 3 | — |
| Technical Paper | ACA-005 | 0.5, 1, 2 | — |

---

## SCORING METRICS

### CREATE Score Components

| Component | Weight | Measurement |
|-----------|--------|-------------|
| **C**larity | 20% | Ambiguity detection, specificity |
| **R**ole | 25% | Persona consistency, domain accuracy |
| **E**xecution | 20% | Step-by-step methodology |
| **A**ccountability | 15% | JSON schema compliance, audit trail |
| **T**hesis-Testing | 10% | Counter-thesis presence |
| **E**vidence | 10% | Source chain, verification |

**Minimum Passing CREATE Score: 85/100**

### Quality Gates

```
GATE_PASS_CRITERIA:
  - Accuracy ≥ 80%
  - CREATE Score ≥ 85
  - Counter-thesis present (if applicable)
  - JSON schema valid
  - No hallucinated citations
  
ANY GATE FAIL → TEMPLATE REJECTED
```

---

## IMPLEMENTATION ROADMAP

### Week 1: Infrastructure
- [ ] Clone all 31 repos to F:\FORGE_TEST_SUITE
- [ ] Configure lm-eval-harness with API keys
- [ ] Create baseline task configs
- [ ] Run baseline benchmarks (1000 samples/category)

### Week 2: FORGE Integration
- [ ] Implement custom task classes for each FORGE template
- [ ] Create prompt injection pipeline
- [ ] Define CREATE scoring automation
- [ ] Run FORGE-enhanced benchmarks

### Week 3: Analysis & Iteration
- [ ] Calculate FORGE_DELTA per category
- [ ] Identify weak templates (delta < +5%)
- [ ] Iterate on underperforming prompts
- [ ] Re-run validation

### Week 4: Production Release
- [ ] Full suite execution (500K samples)
- [ ] Generate comprehensive report
- [ ] Tag FORGE v2.0 for release
- [ ] Update documentation

---

## EXECUTION CHECKLIST

- [ ] Verify F:\FORGE_TEST_SUITE contains all 31 repos
- [ ] Confirm lm-eval-harness installed: `pip show lm-eval`
- [ ] Set API keys: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
- [ ] Run inventory: `dir /s /b F:\FORGE_TEST_SUITE`
- [ ] Execute smoke test (1000 samples)
- [ ] Review results
- [ ] Full suite (overnight)
- [ ] Generate final report
- [ ] Tag release

---

**FORGE v2.0 TEST HARNESS — RECEIPTS FOR EVERYTHING**

**END TEST_HARNESS_SPEC.md**
