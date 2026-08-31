import type { Category } from '../lib/quiz'

export const categories: Category[] = [
  {
    slug: 'interactive',
    name: 'Forge Trials',
    icon: '⚒️',
    description: 'Write real Rust code in the browser editor. Step from single-line warmups to full systems with instant test feedback.',
    isInteractive: true,
  },
  {
    slug: 'ownership',
    name: 'Ownership',
    icon: '🔒',
    description: 'Move, copy, and the rules that keep memory safe.',
  },
  {
    slug: 'lifetimes',
    name: 'Lifetimes',
    icon: '⏳',
    description: 'How long references are valid and why the borrow checker cares.',
  },
  {
    slug: 'traits',
    name: 'Traits',
    icon: '💎',
    description: 'Interfaces, bounds, and the superpowers of generic code.',
  },
  {
    slug: 'concurrency',
    name: 'Concurrency',
    icon: '⚔️',
    description: 'Threads, Send/Sync, and fearless parallelism patterns.',
  },
  {
    slug: 'pointers',
    name: 'Smart Pointers',
    icon: '📦',
    description: 'Box, Rc/Arc, RefCell: ownership patterns in the wild.',
  },
  {
    slug: 'macros',
    name: 'Macros',
    icon: '✨',
    description: 'Declarative macros and practical macro usage.',
  },
  {
    slug: 'error-handling',
    name: 'Error Handling',
    icon: '⚠️',
    description: 'Result, Option, and designing recoverable error flows.',
  },
  {
    slug: 'iterators-closures',
    name: 'Iterators & Closures',
    icon: '🔁',
    description: 'Lazy evaluation, functional patterns, and capture semantics.',
  },
  {
    slug: 'borrow-checker',
    name: 'Borrow Checker',
    icon: '🚨',
    description: 'Understanding aliasing, mutation, and lifetime reasoning.',
  },
]
