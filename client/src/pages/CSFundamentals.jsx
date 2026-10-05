import React, { useState } from 'react';
import {
  BookOpen,
  Database,
  Cpu,
  Globe,
  Layers,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const CS_MODULES = [
  {
    id: 'os',
    title: 'Operating Systems',
    icon: Cpu,
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    topics: [
      {
        name: 'Process vs Thread',
        desc: 'Processes run in independent memory spaces. Threads share the parent process memory, heap, and open handles.',
        keyPoints: ['Process Control Block (PCB)', 'Context Switching overhead', 'Shared vs Isolated memory'],
      },
      {
        name: 'Virtual Memory & Paging',
        desc: 'Virtual memory allows execution of processes that may not be completely in physical RAM by using page tables.',
        keyPoints: ['Page Faults', 'TLB (Translation Lookaside Buffer)', 'Page Replacement Algorithms (LRU, FIFO)'],
      },
      {
        name: 'Deadlocks & Coffman Conditions',
        desc: 'A deadlock occurs when processes wait indefinitely for resources held by each other.',
        keyPoints: ['Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait', 'Banker Algorithm'],
      },
    ],
  },
  {
    id: 'dbms',
    title: 'Database Management (DBMS & SQL)',
    icon: Database,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    topics: [
      {
        name: 'ACID Properties',
        desc: 'Guarantees transaction reliability in relational databases.',
        keyPoints: ['Atomicity (All or Nothing)', 'Consistency (Valid State)', 'Isolation (Concurrency Control)', 'Durability (Persistence)'],
      },
      {
        name: 'B-Tree & Database Indexing',
        desc: 'Indexes structure data to enable O(log N) lookup instead of O(N) full table scans.',
        keyPoints: ['Clustered vs Non-Clustered Indexes', 'B+ Tree structure', 'Composite Indexes'],
      },
      {
        name: 'SQL Joins & Normalization',
        desc: 'Combining relational tables and reducing data redundancy (1NF, 2NF, 3NF, BCNF).',
        keyPoints: ['INNER, LEFT, RIGHT, FULL JOIN', 'Normalization forms', 'Foreign key constraints'],
      },
    ],
  },
  {
    id: 'cn',
    title: 'Computer Networks',
    icon: Globe,
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
    topics: [
      {
        name: 'OSI 7-Layer & TCP/IP Model',
        desc: 'Layered architecture for network communication from Physical layer to Application layer.',
        keyPoints: ['Application, Transport, Network, Link layers', 'IP Routing', 'MAC Addresses'],
      },
      {
        name: 'TCP 3-Way Handshake & UDP',
        desc: 'TCP provides reliable connection-oriented transport; UDP provides fast connectionless datagram delivery.',
        keyPoints: ['SYN -> SYN-ACK -> ACK', 'Flow Control & Windowing', 'UDP for Low-Latency Streaming'],
      },
      {
        name: 'HTTP / HTTPS & TLS Protocol',
        desc: 'Web protocols for data transfer. HTTPS encrypts HTTP using TLS/SSL asymmetric key exchange.',
        keyPoints: ['HTTP Methods & Status Codes', 'Symmetric vs Asymmetric Encryption', 'TLS Handshake'],
      },
    ],
  },
  {
    id: 'oop',
    title: 'Object-Oriented Programming',
    icon: Layers,
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    topics: [
      {
        name: '4 Pillars of OOP',
        desc: 'Core software design paradigms for modular and extensible code.',
        keyPoints: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism (Overloading & Overriding)'],
      },
      {
        name: 'Abstract Class vs Interface',
        desc: 'Interfaces specify pure contracts; Abstract classes allow partial implementations and member variables.',
        keyPoints: ['Single vs Multiple Inheritance', 'Default methods', 'Polymorphic references'],
      },
    ],
  },
];

export function CSFundamentals() {
  const [activeModule, setActiveModule] = useState('os');
  const [expandedTopic, setExpandedTopic] = useState(null);

  const currentModule = CS_MODULES.find((m) => m.id === activeModule) || CS_MODULES[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" /> CS Core Curriculum
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Computer Science Fundamentals
          </h1>
          <p className="mt-2 text-slate-400 max-w-2xl text-sm sm:text-base">
            Master core computer science subjects required for technical interviews at top tech companies.
          </p>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CS_MODULES.map((mod) => {
          const Icon = mod.icon;
          const isActive = mod.id === activeModule;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-slate-950 border border-slate-800 mb-3`}>
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white">{mod.title}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{mod.topics.length} Key Topics</p>
            </button>
          );
        })}
      </div>

      {/* Active Module Topics */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> {currentModule.title} Core Topics
        </h2>

        <div className="space-y-4">
          {currentModule.topics.map((tp, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {tp.name}
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{tp.desc}</p>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Key Concepts & Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tp.keyPoints.map((kp, kIdx) => (
                    <span
                      key={kIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono"
                    >
                      {kp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
