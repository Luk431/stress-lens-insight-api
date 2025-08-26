import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Activity, Brain, Heart, Moon, Smartphone, Target, Circle } from "lucide-react";

export interface StressInput {
  SleepHours?: number;
  DiasActividadFisica?: number;
  horariolaboral: string;
  contactoFueraDeHorario: boolean;
  energiaAlDespertar: number; // scale 1-5
  genero: string;
  edad: number;
  ScreenTimeHours?: number;
  Steps?: number;
  HeartRate: number;
  Mood: number; // scale 1-5
  cantidadHorasTrabajoDiario: number;
}

interface StressInsight {
  stressLevel: number;
  //riskFactors: string[];
  recommendations: string[];
  score: number;
}

const StressLensAssessment = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState<StressInsight | null>(null);
  const [formData, setFormData] = useState<StressInput>({
    SleepHours: 7,
    DiasActividadFisica: 3,
    horariolaboral: "9-17",
    contactoFueraDeHorario: false,
    energiaAlDespertar: 3,
    genero: "",
    edad: 30,
    ScreenTimeHours: 6,
    Steps: 8000,
    HeartRate: 70,
    Mood: 3,
    cantidadHorasTrabajoDiario: 8,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      //https://localhost:7126
      //https://localhost:44335
      // const response = await fetch('https://localhost:44335/insight', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to get stress insight');
      // }

      // const result = await response.json();
      // const raw = result.choices[0].message.content;
      // const cleaned = raw.replace(/```json\n?/, "").replace(/```/, "").trim();
      // const data = JSON.parse(cleaned);
      const data: StressInsight = {
        recommendations: ["Dedica 15 minutos a un ejercicio de respiración consciente."],
        stressLevel: 2,
        score: 1
      };
      setInsight(data);
      
      toast({
        title: "Assessment Complete",
        description: "Your stress analysis is ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze stress data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof StressInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 1) return { color: 'text-traffic-green', bg: 'bg-traffic-green/20', name: 'Low', trafficColor: 'traffic-green' };
    if (level <= 2) return { color: 'text-traffic-yellow', bg: 'bg-traffic-yellow/20', name: 'Medium', trafficColor: 'traffic-yellow' };
    return { color: 'text-traffic-red', bg: 'bg-traffic-red/20', name: 'High', trafficColor: 'traffic-red' };
  };

  if (insight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stress-calm to-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-stress-primary/20 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-stress-primary to-stress-secondary rounded-full flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-stress-brand" />
              </div>
              <CardTitle className="text-2xl text-stress-brand">Your Stress Analysis</CardTitle>
              <CardDescription>Based on your data, here's your personalized insight</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-stress-calm/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-stress-brand" />
                      Stress Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ 
                          backgroundColor: insight.stressLevel <= 1 ? 'hsl(122, 39%, 49%)' : 
                                         insight.stressLevel <= 2 ? 'hsl(44, 100%, 70%)' : 
                                         'hsl(343, 81%, 61%)'
                        }}
                      >
                        <Circle className="h-8 w-8 text-white fill-current" />
                      </div>
                      <div>
                        <div className={`text-3xl font-bold ${getStressLevelColor(insight.stressLevel).color}`}>
                          {insight.stressLevel}/3
                        </div>
                        <div className={`text-sm font-medium ${getStressLevelColor(insight.stressLevel).color}`}>
                          {getStressLevelColor(insight.stressLevel).name} Risk
                        </div>
                        {/* <div className="text-sm text-muted-foreground mt-1">
                          Overall Score: {insight.score}%
                        </div> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-stress-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                    {insight.stressLevel == 1 && (<CardTitle className="text-lg">🟢 Riesgo Bajo – Mantenimiento</CardTitle>)}
                    {insight.stressLevel == 2 && (<CardTitle className="text-lg">🟡 Riesgo Medio – Prevención intensiva
</CardTitle>)}
                    {insight.stressLevel == 3 && (<CardTitle className="text-lg">🔴 Riesgo Alto – Intervención activa</CardTitle>)}
                  </CardHeader>
                  <CardContent>
                    {insight.stressLevel === 1 && (
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Seguí con tus rutinas saludables.</li>
                        <li>Pequeñas pausas de 5 min para moverte.</li>
                        <li>Hidratate bien durante el día.</li>
                      </ul>
                    )}

                    {insight.stressLevel === 2 && (
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Dormí 30 min más que ayer.</li>
                        <li>Reemplazá una comida con harinas/azúcar por fruta o proteína.</li>
                        <li>Movete 15–20 min (caminar, estirarte, subir escaleras).</li>
                        <li>Hacé 2 pausas breves de 2–3 min durante la jornada.</li>
                        <li>Movete 20–30 min suave (caminata relajada).</li>
                        <li>Si tu humor ≤ 3, mandá un mensaje breve a alguien de confianza.</li>
                      </ul>
                    )}

                    {insight.stressLevel === 3 && (
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Hacé una pausa guiada de 10 min (respiración + estiramientos).</li>
                        <li>Tené un día sin ultraprocesados ni bebidas azucaradas.</li>
                        <li>Prioridad: 7–8 h de sueño esta noche (pantallas off 60 min antes).</li>
                        <li>Movete 20–30 min suave (caminata relajada).</li>
                        <li>Buscá un contacto social significativo (llamada o encuentro breve).</li>
                      </ul>
                    )}
                  </CardContent>
                </Card>

              </div>

              <Card className="bg-stress-success/20">
                <CardHeader>
                  <CardTitle className="text-lg">Extra IA Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <div className="text-2xl font-bold text-stress-brand">
                      {insight.recommendations}
                    </div>
                  </ul>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center pt-4">
                <Button 
                  variant="stress-primary" 
                  size="lg"
                  onClick={() => setInsight(null)}
                >
                  Take New Assessment
                </Button>
                {/* <Button variant="stress-secondary" size="lg">
                  Access Resources
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stress-calm to-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <div className="mx-auto mb-6 flex justify-center" style={{ marginBottom: -5}} id='headerImgDiv'>
            <img 
              src="/lovable-uploads/cd3db1c1-978a-4b6b-a3a5-995b3c1bfbd6.png" 
              alt="StressLens - Measure early signs of stress and burnout" 
              className="object-contain rounded-tl-lg rounded-tr-lg"
              id='headerImg'
            />
          </div>
          {/* <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Measure early signs of stress and burnout through comprehensive data analysis
          </p> */}
        </div>

        <Card className="border-stress-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-stress-brand">Stress Assessment</CardTitle>
            <CardDescription className="text-center">
              Please provide your information for a personalized stress analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Sleep & Physical Activity */}
                <Card className="bg-stress-calm/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Moon className="h-5 w-5" />
                      Sleep & Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="sleep">Sleep Hours per Night</Label>
                      <Input
                        id="sleep"
                        type="number"
                        min="1"
                        max="12"
                        value={formData.SleepHours || ''}
                        onChange={(e) => updateFormData('SleepHours', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="exercise">Days of Physical Activity per Week</Label>
                      <Input
                        id="exercise"
                        type="number"
                        min="0"
                        max="7"
                        value={formData.DiasActividadFisica || ''}
                        onChange={(e) => updateFormData('DiasActividadFisica', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="steps">Daily Steps</Label>
                      <Input
                        id="steps"
                        type="number"
                        min="0"
                        value={formData.Steps || ''}
                        onChange={(e) => updateFormData('Steps', parseInt(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Work & Digital */}
                <Card className="bg-stress-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Work & Digital
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="workHours">Work Schedule</Label>
                      <Select value={formData.horariolaboral} onValueChange={(value) => updateFormData('horariolaboral', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work hours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9-17">9 AM - 5 PM</SelectItem>
                          <SelectItem value="8-16">8 AM - 4 PM</SelectItem>
                          <SelectItem value="10-18">10 AM - 6 PM</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                          <SelectItem value="night-shift">Night Shift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dailyWorkHours">Daily Work Hours</Label>
                      <Input
                        id="dailyWorkHours"
                        type="number"
                        min="1"
                        max="16"
                        value={formData.cantidadHorasTrabajoDiario}
                        onChange={(e) => updateFormData('cantidadHorasTrabajoDiario', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="screenTime">Screen Time Hours per Day</Label>
                      <Input
                        id="screenTime"
                        type="number"
                        min="0"
                        max="20"
                        value={formData.ScreenTimeHours || ''}
                        onChange={(e) => updateFormData('ScreenTimeHours', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="afterHours">Contact Outside Work Hours</Label>
                      <Switch
                        id="afterHours"
                        checked={formData.contactoFueraDeHorario}
                        onCheckedChange={(checked) => updateFormData('contactoFueraDeHorario', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Health & Wellness */}
                <Card className="bg-stress-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Health Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="heartRate">Resting Heart Rate (BPM)</Label>
                      <Input
                        id="heartRate"
                        type="number"
                        min="40"
                        max="120"
                        value={formData.HeartRate}
                        onChange={(e) => updateFormData('HeartRate', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Energy Level Upon Waking: {formData.energiaAlDespertar}</Label>
                      <Slider
                        value={[formData.energiaAlDespertar]}
                        onValueChange={([value]) => updateFormData('energiaAlDespertar', value)}
                        min={1}
                        max={5}
                        step={1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Very Low</span>
                        <span>Very High</span>
                      </div>
                    </div>
                    <div>
                      <Label>Current Mood: {formData.Mood}</Label>
                      <Slider
                        value={[formData.Mood]}
                        onValueChange={([value]) => updateFormData('Mood', value)}
                        min={1}
                        max={5}
                        step={1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Very Low</span>
                        <span>Very High</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Info */}
                <Card className="bg-stress-warning/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Personal Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.genero} onValueChange={(value) => updateFormData('genero', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        min="16"
                        max="100"
                        value={formData.edad}
                        onChange={(e) => updateFormData('edad', parseInt(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4 justify-center pt-6">
                <Button 
                  type="submit" 
                  variant="stress-primary" 
                  size="lg"
                  disabled={isLoading || !formData.genero}
                  className="min-w-[200px]"
                >
                  {isLoading ? "Analyzing..." : "Check my stress level"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StressLensAssessment;