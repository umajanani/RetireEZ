import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RetirementData {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
}

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid grid-2">
      <div class="card">
        <h2 class="text-primary text-medium" style="margin-bottom: 24px;">📊 Your Info</h2>
        
        <div class="form-group">
          <label>Current Age</label>
          <input type="number" class="form-control" [(ngModel)]="data.currentAge" (input)="calculate()">
        </div>
        
        <div class="form-group">
          <label>Retirement Age</label>
          <input type="number" class="form-control" [(ngModel)]="data.retirementAge" (input)="calculate()">
        </div>
        
        <div class="form-group">
          <label>Current Savings ($)</label>
          <input type="number" class="form-control" [(ngModel)]="data.currentSavings" (input)="calculate()">
        </div>
        
        <div class="form-group">
          <label>Monthly Contribution ($)</label>
          <input type="number" class="form-control" [(ngModel)]="data.monthlyContribution" (input)="calculate()">
        </div>
        
        <div class="form-group">
          <label>Expected Annual Return (%)</label>
          <input type="number" step="0.1" class="form-control" [(ngModel)]="data.expectedReturn" (input)="calculate()">
        </div>
        
        <div class="form-group">
          <label>Inflation Rate (%)</label>
          <input type="number" step="0.1" class="form-control" [(ngModel)]="data.inflationRate" (input)="calculate()">
        </div>
      </div>
      
      <div class="card">
        <h2 class="text-primary text-medium" style="margin-bottom: 24px;">🎯 Your Results</h2>
        
        <div class="text-center" style="margin-bottom: 30px;">
          <div class="text-large text-success">{{ formatCurrency(totalAtRetirement) }}</div>
          <p style="color: #666; margin-top: 8px;">Total at Retirement</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span>Years to Retirement:</span>
            <strong>{{ yearsToRetirement }}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span>Total Contributions:</span>
            <strong>{{ formatCurrency(totalContributions) }}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span>Investment Growth:</span>
            <strong class="text-success">{{ formatCurrency(investmentGrowth) }}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Monthly Income (4% rule):</span>
            <strong class="text-primary">{{ formatCurrency(monthlyIncome) }}</strong>
          </div>
        </div>
        
        <div class="text-center">
          <div [ngClass]="getRecommendationClass()" style="padding: 16px; border-radius: 8px; font-weight: 500;">
            {{ getRecommendation() }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="card" style="margin-top: 20px;">
      <h3 class="text-primary" style="margin-bottom: 16px;">📊 How You Compare to Peers</h3>
      <div class="grid grid-2" style="margin-bottom: 30px;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
          <h4 style="color: #667eea; margin-bottom: 12px;">💰 Your Progress</h4>
          <div style="font-size: 1.8rem; font-weight: 700; color: #28a745;">{{ getPeerRank() }}</div>
          <p style="color: #666; margin-top: 8px;">{{ getPeerMessage() }}</p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
          <h4 style="color: #667eea; margin-bottom: 12px;">🎯 Peer Averages</h4>
          <div style="margin-bottom: 8px;">Monthly Savings: <strong>${{ getPeerAverage('savings') }}</strong></div>
          <div style="margin-bottom: 8px;">Total Saved: <strong>${{ getPeerAverage('total') }}</strong></div>
          <div>Retirement Goal: <strong>${{ getPeerAverage('goal') }}</strong></div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h3 class="text-primary" style="margin-bottom: 16px;">💡 Gen Z Money Tips</h3>
      <div class="grid grid-2">
        <div>
          <h4>🚀 Start Early Advantage</h4>
          <p>Starting at 22 vs 32 can mean $500K+ more at retirement due to compound interest!</p>
        </div>
        <div>
          <h4>📱 Use Tech</h4>
          <p>Automate investments with apps like Acorns, Robinhood, or your bank's auto-transfer.</p>
        </div>
        <div>
          <h4>🎯 Target Date Funds</h4>
          <p>Set-and-forget investing that automatically adjusts as you age.</p>
        </div>
        <div>
          <h4>💸 Side Hustles</h4>
          <p>Invest gig economy earnings - even $50/month adds up to $100K+ over 40 years!</p>
        </div>
      </div>
    </div>
  `
})
export class PlannerComponent {
  data: RetirementData = {
    currentAge: 25,
    retirementAge: 65,
    currentSavings: 5000,
    monthlyContribution: 500,
    expectedReturn: 7,
    inflationRate: 3
  };

  totalAtRetirement = 0;
  yearsToRetirement = 0;
  totalContributions = 0;
  investmentGrowth = 0;
  monthlyIncome = 0;

  ngOnInit() {
    this.calculate();
  }

  calculate() {
    this.yearsToRetirement = this.data.retirementAge - this.data.currentAge;
    
    if (this.yearsToRetirement <= 0) {
      this.totalAtRetirement = this.data.currentSavings;
      return;
    }

    const monthlyRate = this.data.expectedReturn / 100 / 12;
    const totalMonths = this.yearsToRetirement * 12;
    
    // Future value of current savings
    const futureValueCurrent = this.data.currentSavings * Math.pow(1 + monthlyRate, totalMonths);
    
    // Future value of monthly contributions
    const futureValueContributions = this.data.monthlyContribution * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    this.totalAtRetirement = futureValueCurrent + futureValueContributions;
    this.totalContributions = this.data.currentSavings + (this.data.monthlyContribution * totalMonths);
    this.investmentGrowth = this.totalAtRetirement - this.totalContributions;
    this.monthlyIncome = (this.totalAtRetirement * 0.04) / 12; // 4% rule
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getRecommendation(): string {
    const monthlyNeeded = 4000; // Assumed monthly need
    
    if (this.monthlyIncome >= monthlyNeeded) {
      return "🎉 You're on track! Keep it up!";
    } else if (this.monthlyIncome >= monthlyNeeded * 0.7) {
      return "📈 Close! Consider increasing contributions by $" + 
        Math.round((monthlyNeeded - this.monthlyIncome) * 12 / 0.04 / this.yearsToRetirement / 12);
    } else {
      return "⚠️ Need to boost savings! Try increasing monthly contributions or starting a side hustle.";
    }
  }

  getRecommendationClass(): string {
    const monthlyNeeded = 4000;
    
    if (this.monthlyIncome >= monthlyNeeded) {
      return 'text-success';
    } else if (this.monthlyIncome >= monthlyNeeded * 0.7) {
      return 'text-primary';
    } else {
      return 'text-warning';
    }
  }

  getPeerRank(): string {
    const score = this.calculatePeerScore();
    if (score >= 80) return 'Top 20%';
    if (score >= 60) return 'Top 40%';
    if (score >= 40) return 'Average';
    if (score >= 20) return 'Below Average';
    return 'Getting Started';
  }

  getPeerMessage(): string {
    const score = this.calculatePeerScore();
    if (score >= 80) return 'You\'re crushing it! Keep up the great work.';
    if (score >= 60) return 'Solid progress! You\'re ahead of most peers.';
    if (score >= 40) return 'On track with your generation.';
    if (score >= 20) return 'Room for improvement, but you\'re building habits!';
    return 'Every journey starts with a first step!';
  }

  getPeerAverage(type: string): string {
    const averages = {
      savings: '350',
      total: '8,500',
      goal: '1.2M'
    };
    return averages[type as keyof typeof averages] || '0';
  }

  private calculatePeerScore(): number {
    let score = 0;
    
    // Monthly contribution score (40 points max)
    if (this.data.monthlyContribution >= 500) score += 40;
    else if (this.data.monthlyContribution >= 300) score += 30;
    else if (this.data.monthlyContribution >= 100) score += 20;
    else if (this.data.monthlyContribution > 0) score += 10;
    
    // Current savings score (30 points max)
    if (this.data.currentSavings >= 10000) score += 30;
    else if (this.data.currentSavings >= 5000) score += 20;
    else if (this.data.currentSavings >= 1000) score += 10;
    else if (this.data.currentSavings > 0) score += 5;
    
    // Early start bonus (30 points max)
    if (this.data.currentAge <= 22) score += 30;
    else if (this.data.currentAge <= 25) score += 20;
    else if (this.data.currentAge <= 30) score += 10;
    
    return Math.min(score, 100);
  }
}