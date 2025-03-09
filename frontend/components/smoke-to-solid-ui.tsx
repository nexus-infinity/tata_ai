"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Suspense } from "react"
import { useSpring, animated } from "@react-spring/three"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Layers, Database, Lock, GitBranch, FileCode, ArrowRight } from "lucide-react"

// Particle system for the smoke effect
function ParticleCloud({
  count = 2000,
  size = 0.015,
  opacity = 0.6,
  spread = 3,
  color = "#ffffff",
  speed = 0.1,
  isActive = false,
  onInteract,
}) {
  const mesh = useRef()
  const { viewport } = useThree()

  // Generate random particles
  const particles = useRef([])
  if (particles.current.length === 0) {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
        ),
        size: Math.random() * size + size / 2,
      })
    }
  }

  // Animation properties
  const { particleOpacity, particleSize, particleSpread } = useSpring({
    particleOpacity: isActive ? 0.2 : opacity,
    particleSize: isActive ? size * 0.5 : size,
    particleSpread: isActive ? spread * 0.7 : spread,
    config: { mass: 1, tension: 120, friction: 14 },
  })

  // Update particles on each frame
  useFrame(() => {
    const positions = mesh.current.geometry.attributes.position.array
    const sizes = mesh.current.geometry.attributes.size.array

    for (let i = 0; i < particles.current.length; i++) {
      const particle = particles.current[i]

      // Update position
      particle.position.x += particle.velocity.x * speed
      particle.position.y += particle.velocity.y * speed
      particle.position.z += particle.velocity.z * speed

      // Boundary check
      if (Math.abs(particle.position.x) > particleSpread.get() / 2) {
        particle.velocity.x *= -1
      }
      if (Math.abs(particle.position.y) > particleSpread.get() / 2) {
        particle.velocity.y *= -1
      }
      if (Math.abs(particle.position.z) > particleSpread.get() / 2) {
        particle.velocity.z *= -1
      }

      // Update geometry
      const i3 = i * 3
      positions[i3] = particle.position.x
      positions[i3 + 1] = particle.position.y
      positions[i3 + 2] = particle.position.z
      sizes[i] = particle.size * (isActive ? 0.5 : 1)
    }

    mesh.current.geometry.attributes.position.needsUpdate = true
    mesh.current.geometry.attributes.size.needsUpdate = true
  })

  return (
    <animated.points ref={mesh} onClick={onInteract}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.current.length}
          array={new Float32Array(particles.current.length * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.current.length}
          array={new Float32Array(particles.current.length)}
          itemSize={1}
        />
      </bufferGeometry>
      <animated.pointsMaterial
        size={particleSize}
        color={color}
        transparent
        opacity={particleOpacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </animated.points>
  )
}

// Scene setup
function Scene({ isActive, onInteract }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <ParticleCloud isActive={isActive} onInteract={onInteract} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </>
  )
}

// Module cards that will emerge from the smoke
const moduleCards = [
  {
    id: "core",
    name: "Core",
    description: "Central decision-making engine",
    icon: Layers,
    color: "bg-blue-500",
    metrics: {
      requests: "1.2K/min",
      latency: "45ms",
    },
  },
  {
    id: "flow",
    name: "Flow",
    description: "Workflow orchestration system",
    icon: GitBranch,
    color: "bg-green-500",
    metrics: {
      workflows: "342 active",
      throughput: "890/min",
    },
  },
  {
    id: "memex",
    name: "Memex",
    description: "Knowledge management system",
    icon: Database,
    color: "bg-purple-500",
    metrics: {
      storage: "4.2TB",
      queries: "3.4K/min",
    },
  },
  {
    id: "moto",
    name: "Moto",
    description: "Code generation and execution",
    icon: FileCode,
    color: "bg-amber-500",
    metrics: {
      generation: "240/min",
      execution: "180/min",
    },
  },
  {
    id: "zkp",
    name: "ZKP",
    description: "Zero-knowledge proof system",
    icon: Lock,
    color: "bg-red-500",
    metrics: {
      proofs: "890/min",
      verification: "1.2K/min",
    },
  },
]

export function SmokeToSolidUI() {
  const [isActive, setIsActive] = useState(false)
  const [activeModule, setActiveModule] = useState(null)
  const [showCards, setShowCards] = useState(false)

  const handleInteract = () => {
    if (!isActive) {
      setIsActive(true)
      setTimeout(() => setShowCards(true), 500)
    } else if (!activeModule) {
      // If smoke is active but no module is selected, deactivate
      setShowCards(false)
      setTimeout(() => setIsActive(false), 500)
    }
  }

  const handleModuleSelect = (moduleId) => {
    setActiveModule(moduleId)
  }

  const handleBack = () => {
    setActiveModule(null)
  }

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-xl border bg-black">
      {/* Three.js Canvas for the smoke effect */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={null}>
            <Scene isActive={isActive} onInteract={handleInteract} />
          </Suspense>
        </Canvas>
      </div>

      {/* Interaction prompt */}
      {!isActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white">
            <p className="text-2xl font-light">Tap to interact with Tata AI</p>
            <p className="mt-2 text-sm text-white/60">The interface will materialize from the digital ether</p>
          </motion.div>
        </div>
      )}

      {/* Module cards that emerge from the smoke */}
      <AnimatePresence>
        {showCards && !activeModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {moduleCards.map((module) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className="backdrop-blur-md"
                  onClick={() => handleModuleSelect(module.id)}
                >
                  <Card className="overflow-hidden border-none bg-white/10 text-white shadow-glow transition-all hover:bg-white/20 hover:shadow-glow-intense">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className={`rounded-md p-1.5 ${module.color} bg-opacity-80`}>
                          <module.icon className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-base">{module.name}</CardTitle>
                      </div>
                      <CardDescription className="text-white/70">{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(module.metrics).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <p className="text-xs text-white/60 capitalize">{key}</p>
                            <p className="text-sm font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed module view when a module is selected */}
        {activeModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center p-6"
          >
            <Card className="w-full max-w-4xl border-none bg-black/40 text-white backdrop-blur-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const module = moduleCards.find((m) => m.id === activeModule)
                      const ModuleIcon = module.icon
                      return (
                        <>
                          <div className={`rounded-md p-2 ${module.color}`}>
                            <ModuleIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle>{module.name} Module</CardTitle>
                            <CardDescription className="text-white/70">{module.description}</CardDescription>
                          </div>
                        </>
                      )
                    })()}
                    <Badge variant="outline" className="border-green-500 text-green-400">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="bg-white/10">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="metrics" className="data-[state=active]:bg-white/20">
                      Metrics
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-white/20">
                      Settings
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-4 space-y-4">
                    <div className="rounded-lg bg-white/5 p-4">
                      <h3 className="mb-2 text-lg font-medium">Module Status</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1 rounded-md bg-white/10 p-3">
                          <p className="text-xs text-white/60">Current State</p>
                          <p className="text-lg font-medium text-green-400">Operational</p>
                        </div>
                        <div className="space-y-1 rounded-md bg-white/10 p-3">
                          <p className="text-xs text-white/60">Uptime</p>
                          <p className="text-lg font-medium">99.9%</p>
                        </div>
                        <div className="space-y-1 rounded-md bg-white/10 p-3">
                          <p className="text-xs text-white/60">Last Updated</p>
                          <p className="text-lg font-medium">2 mins ago</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-white/5 p-4">
                      <h3 className="mb-2 text-lg font-medium">Quick Actions</h3>
                      <div className="grid gap-2 md:grid-cols-2">
                        <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                          View Detailed Analytics
                        </Button>
                        <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                          Configure Templates
                        </Button>
                        <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                          Check Dependencies
                        </Button>
                        <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                          View Documentation
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="mt-4">
                    <div className="rounded-lg bg-white/5 p-4">
                      <h3 className="mb-4 text-lg font-medium">Performance Metrics</h3>
                      <div className="h-[200px] rounded-md bg-white/10 p-4">
                        <div className="flex h-full items-center justify-center">
                          <p className="text-white/60">Performance metrics visualization would appear here</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-4">
                    <div className="rounded-lg bg-white/5 p-4">
                      <h3 className="mb-4 text-lg font-medium">Module Settings</h3>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm text-white/70">Module Name</label>
                            <input
                              type="text"
                              className="w-full rounded-md border border-white/20 bg-white/5 p-2 text-white outline-none focus:border-blue-500"
                              value={moduleCards.find((m) => m.id === activeModule)?.name}
                              readOnly
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-white/70">Status</label>
                            <select className="w-full rounded-md border border-white/20 bg-white/5 p-2 text-white outline-none focus:border-blue-500">
                              <option>Active</option>
                              <option>Maintenance</option>
                              <option>Disabled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="ghost" className="text-white/70 hover:text-white" onClick={handleBack}>
                  Back to Modules
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Open Full Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction overlay to capture clicks */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={handleInteract}
        style={{ pointerEvents: activeModule ? "none" : "auto" }}
      />
    </div>
  )
}

