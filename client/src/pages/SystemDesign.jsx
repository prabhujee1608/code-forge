import React from 'react';
import { Layers, Cpu, Server, Database, Shield, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const SYSTEM_DESIGN_TOPICS = [
  {
    title: 'URL Shortener (bit.ly)',
    difficulty: 'Hard',
    category: 'Distributed Systems',
    summary: 'Design a high-throughput, low-latency URL shortener service.',
    keyConcepts: [
      'Base62 Encoding from auto-incrementing ID or MD5 hash',
      'Redis Cache in front of database for O(1) redirects',
      'NoSQL key-value database for horizontal scaling',
      'Rate Limiting & Anti-abuse mechanisms',
    ],
    architecture: 'Client -> API Gateway -> Redis Cache -> MongoDB / DynamoDB Cluster',
  },
  {
    title: 'Distributed Rate Limiter',
    difficulty: 'Medium',
    category: 'API Gateway & Security',
    summary: 'Prevent API abuse by limiting user requests per window.',
    keyConcepts: [
      'Token Bucket Algorithm',
      'Leaky Bucket Algorithm',
      'Fixed Window Counter & Sliding Window Log',
      'Redis Atomic Lua Scripts for multi-region consistency',
    ],
    architecture: 'Client -> Load Balancer -> Rate Limiter Middleware (Redis) -> Backend Service',
  },
  {
    title: 'Distributed Caching (Redis / Memcached)',
    difficulty: 'Medium',
    category: 'Caching & Memory',
    summary: 'Optimize database load and decrease read latency using in-memory caching.',
    keyConcepts: [
      'Cache-Aside (Lazy Loading) vs Write-Through vs Write-Back',
      'Eviction Policies: LRU, LFU, FIFO',
      'Cache Stampede & Cache Penetration mitigation',
      'Consistent Hashing for cache cluster partitioning',
    ],
    architecture: 'Application Server -> Redis Cluster (Consistent Hashing) -> Database Read Replicas',
  },
  {
    title: 'Message Queues & Event-Driven Architecture',
    difficulty: 'Hard',
    category: 'Asynchronous Systems',
    summary: 'Decouple services using publish-subscribe streaming queues (Kafka / RabbitMQ).',
    keyConcepts: [
      'Producer -> Broker Topic -> Consumer Group',
      'At-Least-Once vs Exactly-Once Delivery semantics',
      'Partitioning & Offsets',
      'Dead Letter Queue (DLQ) for failed task retries',
    ],
    architecture: 'Microservices -> Kafka Topic (Partitioned) -> Consumer Worker Pool -> Database',
  },
];

export function SystemDesign() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" /> High-Level Architecture
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            System Design & Distributed Architecture
          </h1>
          <p className="mt-2 text-slate-400 max-w-2xl text-sm sm:text-base">
            Master scalable system design patterns, distributed caching, load balancing, message queues, and trade-off estimations for Senior & Mid-level Software Engineering interviews.
          </p>
        </div>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SYSTEM_DESIGN_TOPICS.map((topic, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    topic.difficulty === 'Hard'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {topic.difficulty}
                </span>
                <span className="text-xs font-semibold text-purple-400 font-mono">{topic.category}</span>
              </div>

              <h3 className="text-lg font-bold text-white">{topic.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{topic.summary}</p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Target Architecture:
                </span>
                <code className="text-xs text-cyan-300 font-mono block">{topic.architecture}</code>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Core Components & Trade-offs:
                </span>
                {topic.keyConcepts.map((kc, kIdx) => (
                  <div key={kIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{kc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
