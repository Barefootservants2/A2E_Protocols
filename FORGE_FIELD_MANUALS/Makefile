# FORGE Field Manual — Build System
# Requires: pandoc, texlive (xelatex), eisvogel template
#
# Install:
#   brew install pandoc           (macOS)
#   sudo apt install pandoc       (Ubuntu)
#   Download eisvogel.latex from: https://github.com/Wandmalfarbe/pandoc-latex-template/releases
#   Place in: ~/.local/share/pandoc/templates/
#
# Usage:
#   make vol1-pdf     Build Volume 1 as PDF
#   make vol1-epub    Build Volume 1 as EPUB
#   make all          Build all volumes, all formats
#   make clean        Remove build artifacts

# ============================================================
# CONFIGURATION
# ============================================================

SHARED_DIR    = shared
TEMPLATE_DIR  = templates
BUILD_DIR     = build
SHARED_META   = $(SHARED_DIR)/metadata.yml
ABOUT_US      = $(SHARED_DIR)/00-about-us.md

# Pandoc options shared across all volumes
PANDOC_OPTS = \
	--template eisvogel \
	--pdf-engine=xelatex \
	--top-level-division=chapter \
	--toc \
	--toc-depth=3 \
	--number-sections \
	--highlight-style=tango \
	-V colorlinks=true \
	-V linkcolor=teal \
	-V urlcolor=teal \
	-V geometry:margin=1in

# ============================================================
# VOLUME 1 — MARKET INTELLIGENCE
# ============================================================

VOL1_DIR     = vol-01-market-intelligence
VOL1_META    = $(VOL1_DIR)/metadata.yml
VOL1_OUTPUT  = $(BUILD_DIR)/FORGE_Field_Manual_Vol1_Market_Intelligence.pdf

VOL1_CHAPTERS = \
	$(ABOUT_US) \
	$(VOL1_DIR)/01-introduction.md \
	$(VOL1_DIR)/02-foundation-prompts.md \
	$(VOL1_DIR)/03-advanced-chains.md \
	$(VOL1_DIR)/04-anvil-scoring.md \
	$(VOL1_DIR)/05-assay-evaluation.md \
	$(VOL1_DIR)/06-autopsy-red-flags.md \
	$(VOL1_DIR)/07-real-examples.md \
	$(VOL1_DIR)/08-appendix.md

vol1-pdf: $(BUILD_DIR)
	pandoc $(PANDOC_OPTS) \
		--metadata-file=$(SHARED_META) \
		--metadata-file=$(VOL1_META) \
		$(VOL1_CHAPTERS) \
		-o $(VOL1_OUTPUT)
	@echo "Built: $(VOL1_OUTPUT)"

vol1-epub: $(BUILD_DIR)
	pandoc \
		--metadata-file=$(SHARED_META) \
		--metadata-file=$(VOL1_META) \
		--toc \
		--toc-depth=3 \
		--top-level-division=chapter \
		$(VOL1_CHAPTERS) \
		-o $(BUILD_DIR)/FORGE_Field_Manual_Vol1_Market_Intelligence.epub
	@echo "Built: EPUB"

# ============================================================
# UTILITY TARGETS
# ============================================================

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

all: vol1-pdf vol1-epub

clean:
	rm -rf $(BUILD_DIR)

.PHONY: vol1-pdf vol1-epub all clean
