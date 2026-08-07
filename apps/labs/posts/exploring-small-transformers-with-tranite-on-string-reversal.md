---
title: 'Exploring Small Transformers With Trainite On String Reversal'
authors: [aaishwarya-mishra]
published: August 5, 2026
description: 'An internship experiment using Trainite to explore how width, depth, vocabulary, and positional encoding affect small Transformers learning string reversal.'
category: [Machine Learning, Internship, OSS Experience]
featuredImage:
  src: /posts/exploring-small-transformers-with-tranite-on-string-reversal/trainite.png
  alt: 'Abstract Quansight Labs artwork used as a temporary featured image'
hero:
  imageSrc: /posts/exploring-small-transformers-with-tranite-on-string-reversal/trainite.png
  imageAlt: 'Abstract Quansight Labs artwork used as a temporary hero image'
---

Most of the time when you are working on a new project or just starting out or prototyping you have to write same boilerplate code again and again whether it’s training loop, configs, logging etc

[Trainite](https://github.com/pytorch-ignite/trainite) can help you with that. Trainite is an open-source machine learning toolbox built on top of [PyTorch-Ignite](https://github.com/pytorch/ignite) that takes care of generating this boilerplate code for you. Trainite generates clean, modular Python starter code that you fully own and can customize freely.

Hi, I am Aaishwarya Mishra, during my internship at Quansight, I worked on Trainite, a modular language training toolbox built with PyTorch and PyTorch-Ignite.

It scaffolds a complete training project — model, data pipeline, trainer, config, logging that you then own and edit, so a new experiment doesn't start by reimplementing the same boilerplate and gets out of your way.

We wanted example use cases, so I picked something simple: string reversal. Given `abcdef`, a decoder-only Transformer has to produce `fedcba`.

The main experiment was varying model depth and width to see what mattered.

- Width the hidden size `d_model`, is how much room each token's representation has.
- Depth is how many decoder blocks stack.

The stack itself hasn't changed much since [GPT-2](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf) made the decoder-only design standard; recent families like [Llama 3](https://arxiv.org/abs/2407.21783), [Gemma 2](https://arxiv.org/abs/2408.00118) and [Qwen 2.5](https://arxiv.org/abs/2412.15115) add refinements RMSNorm, grouped-query attention, rotary embeddings on top of the same alternating attention and feed-forward blocks.

Short answer: increasing embedding width gave the most promising results but take that with a grain of salt!

## The String Reversal Task

String reversal is simple given a sequence of characters, the model must generate the same characters in reverse order. It has no semantic meaning and easy to evaluate either the answer is correct or wrong.

Because the experiment uses a decoder-only Transformer, each example is formatted as:

```text
[BOS] [source] [SEP] [reversed target] [EOS]
```

For example:

```text
[BOS] a b c [SEP] c b a [EOS]
```

Causal attention prevents the model from looking ahead. To predict the first target character, the model must locate the final character of the source. It must then continue retrieving source characters in descending order until the complete reversal has been generated.

During autoregressive evaluation, the model receives only:

```text
[BOS] [source] [SEP]
```

It then generates one token at a time until it predicts `[EOS]` or reaches the generation limit. This tests whether the model can produce the complete reversal without being given the correct preceding target tokens.

## Generating The Project

Now that we understand the problem, let's generate a fresh experiment workspace using Trainite. First, we can run `trainite init --help` to explore the available models, datasets, and trainers.

To initialize our experiment, we select the built-in `string-reverse` dataset along with the default `transformer` model and `decoder-trainer`:

```bash
trainite init string-reverse-exp --dataset string-reverse
```

Trainite instantly creates a clean, self-contained project workspace:

```text
string-reverse-exp/
├── config.py
├── config.yaml
├── datasets/
│   ├── string_reverse.py
│   └── transformed.py
├── main.py
├── models/
│   └── transformer.py
├── preprocessors/
│   └── char_tokenizer.py
├── pyproject.toml
├── README.md
├── trainer.py
└── utils.py
```

### What Trainite Gives You

Trainite generates **plain, readable Python code** directly inside your project folder:

- **`config.yaml`**: Configures all model hyperparameters, data ratios, and trainer settings.
- **`models/` & `datasets/`**: Standard PyTorch `nn.Module` and `Dataset` implementations.
- **`trainer.py`**: A complete PyTorch-Ignite training and evaluation engine.
- **`main.py`**: The clean entry point to trigger training.

Because you own all these files, you are completely free to edit, refactor, or customize any part of the codebase to fit your task, just like we are about to do now!

## Customizing Trainite for String Reversal

Trainite generated the initial decoder-only language-model project, including the model, dataset pipeline, trainer, configuration files, and experiment logging. Because these are regular Python files, I could adapt the generated code to the needs of string reversal.

The main changes were:

- **Sequence-level accuracy:** I added exact-match accuracy because high token accuracy can still hide incorrect complete reversals.

  ```python
  def _exact_accuracy_transform(
      output: dict[str, torch.Tensor], ignore_index: int = -100
  ) -> tuple[torch.Tensor, torch.Tensor]:
      targets = output["targets"]
      mask = targets != ignore_index
      correct = (output["logits"].argmax(dim=-1) == targets) | ~mask
      sequence_correct = correct.all(dim=-1)
      return sequence_correct.long(), torch.ones_like(sequence_correct)
  ```

  ```python
  def exact_transform_fn(output):
          return _exact_accuracy_transform(output, ignore_index=ignore_index)

  exact_acc = Accuracy(output_transform=exact_transform_fn)
  exact_acc.attach(evaluator, "exact_accuracy")
  ```

- **Autoregressive evaluation:** After training, the best checkpoint generates each test answer one token at a time, providing a more realistic measure than teacher-forced evaluation alone.

  ```python
  # Feed only [BOS] source [SEP] — no target tokens
  sequences = self.generate(input_ids, self.max_inference_new_tokens, attention_mask)
  predictions = [self.tokenizer.decode(tokens.tolist(), skip_special_tokens=True)
                 for tokens in sequences[:, input_ids.shape[1]:]]

  exact_match = sum(p == t for p, t in zip(predictions, targets)) / total

  # zip_longest so a short or over-long generation counts the missing positions as wrong
  pairs = [pair for p, t in zip(predictions, targets) for pair in zip_longest(p, t)]
  token_accuracy = sum(pred == tgt for pred, tgt in pairs) / len(pairs)
  ```

- **Adaptive learning rate:** I replaced the fixed warmup and decay schedule with `ReduceLROnPlateau`, allowing models of different sizes to converge at different rates.
  ```python
  scheduler = ReduceLROnPlateauScheduler(
      optimizer,
      metric_name=metric_name,
      mode=mode,
      patience=patience,
      factor=factor,
      min_lr=min_lr,
      save_history=True,
  )
  engine.add_event_handler(Events.COMPLETED, scheduler)
  ```
- **Experiment stopping:** Runs stop after reaching perfect validation accuracy, reaching the minimum learning rate, or exhausting their wall-clock budget.

  ```python
  def attach_perfect_accuracy_stopping(val_evaluator: Engine, trainer_engine: Engine) -> None:
      def _check(engine: Engine) -> None:
          if engine.state.metrics.get("exact_accuracy", 0.0) >= 1.0:
              trainer_engine.logger.info("Perfect exact-match accuracy reached — terminating early.")
              trainer_engine.terminate()

      val_evaluator.add_event_handler(Events.COMPLETED, _check)

  ```

That's the workflow Trainite is built for: generate a working project, then edit the parts that are yours.

The complete string-reversal example, including the configuration, training code, and evaluation workflow, is available [here](https://github.com/pytorch-ignite/trainite/tree/main/examples/string_reversal).

## Experimental Setup

Each model trained independently on one fixed source length, 8,000 random alphanumeric strings per length with 1,000 held out for validation:

```python
SEQ_LENS = [8, 16, 32, 64, 96, 128, 160, 192, 224]
SEEDS = [42, 123, 456]
```

An earlier sweep went to length 320, but exact match had already hit zero well before that. Since each length trains separately, none of this says anything about generalizing to unseen lengths — and with 62 characters per position, memorization isn't on the table even at length 8.

All models used [RoPE](https://arxiv.org/abs/2104.09864), with feed-forward width fixed at `2 × d_model`.

| Sweep | Layers | `d_model` | Heads |
| ----- | -----: | --------: | ----: |
| Width |      4 |        16 |     1 |
| Width |      4 |        32 |     2 |
| Width |      4 |        64 |     4 |
| Depth |      6 |        32 |     2 |
| Depth |      8 |        32 |     2 |

Head dimension stayed fixed at 16, so widening the model added heads and feed-forward capacity along with hidden size, the width axis scales three things, the depth axis one. Worth remembering when reading the results.

The four-layer `d_model=32` row belongs to both sweeps. Nine lengths × three seeds x 5 model configs gives **135 runs** in total.

Runs ended on perfect validation accuracy, minimum learning rate, or a two-hour budget. The best checkpoint was then decoded greedily from `[BOS] source [SEP]`, stopping at `[EOS]` or after `source length + 2` tokens.

The main width and depth sweeps used RoPE. I also reran the four-layer width sweep with sinusoidal absolute positional encoding as a separate comparison.

### A small vocabulary detour

While evaluating results I noticed the tokenizer was built from `ascii_letters + digits + punctuation + " "` — 99 tokens including specials, on a task needing 66. A third of the output layer was spent on classes that were never correct answers. I fixed it to alphanumerics only and reran everything, the comparison appears in the Results section. I think comparing results of the old and new runs would be intresting.

<p align="center">
  <img src="/posts/exploring-small-transformers-with-tranite-on-string-reversal/jarvis.png" width="300" alt="jarvis meme">
</p>

## Evaluation Metrics

I tracked two validation metrics: token accuracy and exact-match accuracy. Both were calculated only over the reversed target and `[EOS]`; the source and separator tokens were excluded.

**Token accuracy** measures the proportion of individual target tokens predicted correctly. It is useful for observing partial progress, but it can make a model appear successful even when its complete outputs contain errors.

**Exact-match accuracy** measures the proportion of examples for which every predicted token matches the target sequence. A single incorrect token makes the entire example incorrect, making this the stricter and more meaningful metric for string reversal.

Heatmaps report the mean across three seeds, rounded to two decimals, so a token accuracy of 1.00 can still hide enough errors to decrease exact match.

These validation metrics use teacher-forced predictions and are useful for comparing training runs. After training, the best checkpoint was also evaluated autoregressively by generating the reversed string one token at a time. Autoregressive exact match is therefore the primary end-to-end measure, while the validation metrics provide diagnostic information.

## Results

Accuracy dropped as strings got longer, but not smoothly. Models would do fine up to some length, then fall apart within a step or two.

### Exact match

![Exact-match accuracy, width sweep](/posts/exploring-small-transformers-with-tranite-on-string-reversal/exact-match-width.png)

Wider models reversed longer strings. `d_model=64` got everything right through length 96 and scored `0.97` at 128. At length 160, the mean exact-match accuracy was 0.63, but that hides a sharp split between seeds: [one run solved the task](https://app.clear.ml/projects/9fa782dff14848cf9d65c5be68b7b5cf/experiments/dbeb3f1403f049a3bdc0e66fe21ef4a0/output/execution), while [another failed completely](https://app.clear.ml/projects/9fa782dff14848cf9d65c5be68b7b5cf/experiments/d7258b91f5e045f1b90e2d2ceda08d27/output/execution). The model configuration was identical, only the random seed changed.

![Exact-match accuracy, depth sweep](/posts/exploring-small-transformers-with-tranite-on-string-reversal/exact-match-depth.png)

Adding layers helped less reliably. At length 64 the six-layer model got `0.98`, four layers got `0.40`, and eight layers got `0.76`. At 128 the six- and eight-layer models both sat at `0.33` while four layers failed. The order isn't consistent, and the six-layer model did better at 64 than at 32 which shouldn't happen if depth were what mattered.

Most of this is seed variance. In the eight-layer run at length 64, [one seed got `0.98` token accuracy but only `0.27` exact match](https://app.clear.ml/projects/025cc46dce1f4041bb5edb0a2f3633c9/experiments/330aff8f59014c5da0eabcf6bbcc56eb/output/execution), which pulled the mean down by itself. Near the failure boundary, some seeds learned the task and some never did. With only three seeds that's enough to swing a mean a long way. So a low score here means the model didn't learn reversal with this setup, not that it can't.

### Token accuracy vs exact match

![Token accuracy, width sweep](/posts/exploring-small-transformers-with-tranite-on-string-reversal/token-accuracy-width.png)

![Token accuracy, depth sweep](/posts/exploring-small-transformers-with-tranite-on-string-reversal/token-accuracy-depth.png)

Token accuracy was always higher, sometimes much higher. Four-layer `d_model=32` hit `0.94` token accuracy at length 64 but got only `0.40` of strings fully right. `d_model=16` reached `0.82` at length 16 without a single correct reversal.

### Autoregressive evaluation

I also evaluated each best checkpoint autoregressively, generating the reversed string one token at a time without access to the correct target tokens.

The results were almost identical to validation exact match. Across both sweeps, the differences were no larger than `0.02`, and the same failure boundaries remained. Since autoregressive evaluation did not change the overall interpretation, I will not repeat the configuration-by-configuration analysis here.

_Note: Ar here means Autoregressive_

![Embedding-dimension autoregressive heatmap](/posts/exploring-small-transformers-with-tranite-on-string-reversal/autoregressive-width.png)

![Depth autoregressive heatmap](/posts/exploring-small-transformers-with-tranite-on-string-reversal/autoregressive-depth.png)

### A positional-encoding detour

The main sweeps used RoPE, but I also reran the embedding-dimension sweep with sinusoidal absolute positional encoding. The difference was not subtle.

With RoPE, the `d_model=64` model remained near-perfect through length 128. With absolute positional encoding, the same width averaged 0.54 at length 32 and was effectively at zero from length 64 onward. Interestingly, d_model=32 did slightly better at lengths 64 and 96, another reminder that these results are noisy across only three seeds.

These results suggest that model size was not the only thing that mattered for string reversal the choice of positional encoding also had a substantial effect.

![Absolute positional encoding plot](/posts/exploring-small-transformers-with-tranite-on-string-reversal/absolute-positional-encoding.png)

### Did fixing the vocabulary help?

The earlier sweep used a 99-token vocabulary even though the dataset required only 66 tokens. After fixing the mismatch, I reran every experiment under the same setup.

| Model                  | Sequence length | Old vocabulary | Corrected vocabulary |
| ---------------------- | --------------: | -------------: | -------------------: |
| 4 layers, `d_model=64` |             128 |           0.67 |                 0.97 |
| 4 layers, `d_model=64` |             160 |           0.00 |                 0.63 |
| 4 layers, `d_model=32` |              64 |           0.31 |                 0.40 |
| 6 layers, `d_model=32` |              64 |           0.50 |                 0.98 |
| 8 layers, `d_model=32` |              96 |           0.96 |                 0.36 |

The widest model showed the clearest improvement: after correcting the vocabulary, it remained near-perfect at length 128 and began solving length 160. The other configurations were less predictable. Some improved substantially, while the eight-layer result at length 96 became worse.

So yes, the output vocabulary affected performance but it was not as simple as “smaller vocabulary, better model.” The rerun changed the failure boundaries while also revealing how sensitive these models were to initialization and training.

## A Quick Look At Attention

<p align="center">
  <img src="/posts/exploring-small-transformers-with-tranite-on-string-reversal/attention-cat.jpg" width="300" alt="A cat asking for attention">
</p>

To get a qualitative view of what the model learned, I inspected the attention matrices from a successful four-layer, `d_model=64` model on a short example:

```text
Input:  abcdefgh
Output: hgfedcba
```

Rows represent query positions and columns represent key positions. During generation, a reversal-aligned pattern appears when queries from `[SEP]` onward move backwards through the source tokens.

![Layer 3 attention figure](/posts/exploring-small-transformers-with-tranite-on-string-reversal/layer-3-attention.png)

_Note: layers started with index 0 so layer 3 here represents final layer_

The clearest pattern appeared in the final layer. In the lower-left part of the matrices, successive target positions attend to source positions in reverse order, producing the bright diagonal visible across several heads. The earlier layers were more diffuse, while the final layer showed a much cleaner positional lookup.

### Can we force the correct attention?

As a small experiment, I injected an ideal reversal-aligned attention matrix into every possible head and layer of a failed model. Some interventions improved token accuracy by around `0.10`, while others made it worse. Correct attention alone was not enough the learned projections, other blocks, and residual stream still affected the output.

I also built a hand-written attention demo using a reversal specific modification of RoPE. The key rotations are shifted using the known `[SEP]` position, making attention peak at the mirrored source token. It reverses perfectly, but both the reversal rule and separator position are built into the mechanism, so this is not a standard Transformer implementation. It is simply a constructive example showing that attention can express the required lookup. You can check it out [here](https://colab.research.google.com/drive/1y7YjWYqchI-BQhdkiTCfzttfJMZ4q42p?usp=sharing).

## Conclusion

What started as a small example for Trainite turned into a useful stress test for small Transformers. String reversal looks trivial, but the models developed sharp failure boundaries as the sequences became longer.

Increasing width produced the clearest improvement, while adding depth was much less predictable. Near the failure boundary, results often depended on the random seed, and the positional-encoding experiment showed that model size was not the only architectural choice that mattered. The gap between token accuracy and exact match was another useful reminder that getting most tokens right is not the same as solving the task.

These experiments are too small to establish a general rule about Transformer scaling: the models were not parameter-matched, each length was trained separately, and only three seeds were used. Still, they served their purpose. Trainite gave me a complete project that I could freely modify, from the tokenizer and evaluation loop to the scheduler and attention inspection, without rebuilding the training infrastructure each time.

<p align="center">
  <img src="/posts/exploring-small-transformers-with-tranite-on-string-reversal/we-are-so-back.jpg" width="300" alt="A celebratory we-are-so-back meme">
</p>

_How it felt working on this experiment_

That was the main takeaway for me: the experiment did not produce one clean scaling law, but it produced a much better example of the kind of iterative experimentation Trainite is meant to support.
