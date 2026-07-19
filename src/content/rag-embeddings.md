# RAG & Embeddings

RAG gets treated like dark magic. It is three simple ideas stacked on top of each other, and once you see them separately, the whole thing clicks.

## Idea 1: Embeddings turn text into coordinates

An embedding model takes a piece of text and turns it into a vector: a long list of numbers, typically around a thousand of them. Think of it as a point in a huge space, positioned by meaning. "How do I reset my password?" and "I forgot my login credentials" land close together in that space even though they share almost no words. "How do I reset my password?" and "Our Q3 revenue grew 12%" land far apart.

That is the entire trick. Similar meaning = nearby points. Everything else in RAG is built on it.

One thing worth knowing up front: Anthropic does not ship its own embedding model. The official docs point to third-party providers, with Voyage AI as the worked example, and suggest evaluating a few vendors for your use case. Any solid embedding model works with Claude, since embeddings only handle the finding, not the answering.

## Idea 2: Semantic search

Once your documents are embedded, search becomes geometry:

1. Split your documents into chunks and embed each chunk once. Store the vectors (in a vector database, or a plain array if your corpus is small).
2. When a question comes in, embed the question with the same model.
3. Find the stored chunks whose vectors are nearest to the question's vector.

The nearest chunks are the most semantically relevant, no keyword overlap required. That beats classic keyword search exactly where keyword search fails: users never phrase questions the way your docs phrase answers.

## Idea 3: RAG = retrieve, then generate

Retrieval Augmented Generation is semantic search plus one more step: take the top matching chunks and paste them into the prompt, then ask Claude to answer *using that material*.

```text
Answer the question using only the provided context.
If the context does not contain the answer, say so.

<context>
...top 5 retrieved chunks...
</context>

<question>
What is our refund window for annual plans?
</question>
```

Why bother? Two reasons:

- **Claude answers from your data.** Its training data does not include your internal wiki, your product docs, or yesterday's support tickets. RAG puts them in front of the model at answer time.
- **Fewer hallucinations.** When the model has the real text in context and instructions to stick to it, it grounds its answer in that text instead of improvising. Telling it to admit when the context does not cover the question closes the loop.

## Chunking basics

How you split documents matters more than which vector database you buy.

- **Split by structure, not by character count.** Headings, paragraphs, list items, functions. A chunk should be a self-contained thought; a split mid-sentence embeds as noise.
- **Overlap adjacent chunks.** Repeating a bit of text between neighbors keeps meaning intact when an idea straddles a boundary.
- **Size is a tradeoff.** Small chunks give precise matches but lose surrounding context; large chunks keep context but retrieve fuzzily. Start with paragraph-to-section sized pieces and tune against real queries.
- **Attach metadata.** Prefixing each chunk with its document title and section makes both retrieval and Claude's citations noticeably better.

These are standard community practice rather than official Anthropic doctrine, but they are where most RAG quality problems actually live.

## When RAG is overkill

Here is the step people skip: check whether you need RAG at all.

Current Claude models have context windows of up to 1M tokens, which comfortably holds entire codebases or several books. If your whole corpus fits in the context window, skip the pipeline and put the documents straight in the prompt. No chunking bugs, no retrieval misses, no infrastructure. Pair it with prompt caching so you are not paying to reprocess the same documents every request (see [Cost, Latency & Caching](/docs/cost-caching)).

Two caveats keep RAG relevant:

- **Context rot.** The official docs are explicit that more context is not automatically better; as token count grows, accuracy and recall degrade. Curating what goes in matters even when everything technically fits.
- **Scale.** A million tokens is a lot, but a real knowledge base blows past it fast. When the corpus is bigger than the window, retrieval is how you choose which slice the model sees.

A sane progression: start with everything-in-context, add prompt caching when cost bites, and reach for RAG only when the corpus outgrows the window or answer quality drops from context bloat.

Next: [Cost, Latency & Caching](/docs/cost-caching)

**Official links:** [Embeddings](https://platform.claude.com/docs/en/build-with-claude/embeddings) · [Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) · [RAG cookbook recipe](https://platform.claude.com/cookbook/third-party-pinecone-rag-using-pinecone)
