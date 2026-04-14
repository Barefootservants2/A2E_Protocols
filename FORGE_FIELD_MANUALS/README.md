# FORGE Field Manual Series

**Practitioner's Guides to AI-Assisted Analysis — Built by Ashes2Echoes LLC**

## What This Is

A 10-volume series of technical field manuals teaching professionals how to use multi-agent AI systems for structured analysis across 10 domains. Each volume contains 100-150+ battle-tested prompts with scored outputs, the ANVIL/ASSAY/AUTOPSY evaluation framework, and real examples from production use.

## The Volumes

| Vol | Title | Status |
|-----|-------|--------|
| 1 | Market Intelligence | **SCAFFOLD COMPLETE** |
| 2 | Contract & Legal | Planned |
| 3 | Code Architecture | Planned |
| 4 | ML & AI Evaluation | Planned |
| 5 | Business Strategy | Planned |
| 6 | Defense & Engineering | Planned |
| 7 | Content & Marketing | Planned |
| 8 | Operations & Automation | Planned |
| 9 | Consulting & Advisory | Planned |
| 10 | Research & Intelligence | Planned |

## Build System

Volumes are written in Markdown and compiled to PDF/EPUB using Pandoc + Eisvogel.

### Prerequisites

- [Pandoc](https://pandoc.org/) (3.x+)
- TeX Live (for PDF via XeLaTeX)
- [Eisvogel template](https://github.com/Wandmalfarbe/pandoc-latex-template)

### Build

```bash
make vol1-pdf    # Build Volume 1 PDF
make vol1-epub   # Build Volume 1 EPUB
make all         # Build everything
```

## Directory Structure

```
FORGE_FIELD_MANUALS/
├── shared/                  # Content shared across all volumes
│   ├── metadata.yml         # Series-level Pandoc metadata
│   └── 00-about-us.md       # The A2E story (Chapter 0 in every volume)
├── vol-01-market-intelligence/
│   ├── metadata.yml          # Volume-specific metadata
│   ├── 01-introduction.md    # Domain context + source citations
│   ├── 02-foundation-prompts.md
│   ├── 03-advanced-chains.md
│   ├── 04-anvil-scoring.md
│   ├── 05-assay-evaluation.md
│   ├── 06-autopsy-red-flags.md
│   ├── 07-real-examples.md
│   └── 08-appendix.md
├── templates/                # Custom Pandoc/LaTeX templates
├── Makefile                  # Build automation
└── README.md
```

## License

Proprietary. © 2026 Ashes2Echoes LLC. All rights reserved.

## Contact

ashes2echoes.platform@gmail.com
