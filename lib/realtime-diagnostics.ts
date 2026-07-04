/**
 * Realtime Channel Diagnostics Script
 * 
 * Add this to browser console or include in your app temporarily to verify the fix.
 * This helps monitor and debug Supabase Realtime channel subscriptions.
 */

// ============================================================================
// 1. ACTIVE CHANNELS MONITOR
// ============================================================================

export function logActiveChannels() {
  const { supabase } = require('@/lib/supabase');
  
  const channels = supabase.getChannels();
  
  console.group('📡 Active Realtime Channels');
  console.log(`Total channels: ${channels.length}`);
  
  if (channels.length === 0) {
    console.log('No active channels');
    console.groupEnd();
    return;
  }
  
  const channelInfo = channels.map((channel: { topic: string; state: string; listeners?: Array<unknown> }) => ({
    topic: channel.topic,
    state: channel.state,
    listeners: channel.listeners?.length || 0,
  }));
  
  console.table(channelInfo);
  
  // Check for duplicates
  const topicCounts: Record<string, number> = {};
  channels.forEach((ch: { topic: string }) => {
    topicCounts[ch.topic] = (topicCounts[ch.topic] || 0) + 1;
  });
  
  const duplicates = Object.entries(topicCounts).filter(([_, count]) => count > 1);
  
  if (duplicates.length > 0) {
    console.warn('⚠️ DUPLICATE CHANNELS DETECTED:');
    duplicates.forEach(([topic, count]) => {
      console.warn(`  ${topic}: ${count} instances`);
    });
  } else {
    console.log('✓ No duplicate channels');
  }
  
  console.groupEnd();
}

// ============================================================================
// 2. SUBSCRIPTION STATE MONITOR
// ============================================================================

export function monitorChannelStates() {
  const { supabase } = require('@/lib/supabase');
  
  console.group('🔍 Channel State Monitoring');
  
  const channels = supabase.getChannels();
  
  const states: Record<string, string[]> = {
    subscribed: [],
    subscribing: [],
    unsubscribed: [],
    closed: [],
    error: [],
  };
  
  channels.forEach((channel: { state?: string; topic: string }) => {
    const state = channel.state || 'unknown';
    if (states[state]) {
      states[state].push(channel.topic);
    }
  });
  
  Object.entries(states).forEach(([state, topics]) => {
    if (topics.length > 0) {
      console.log(`${state.toUpperCase()}: ${topics.join(', ')}`);
    }
  });
  
  console.groupEnd();
}

// ============================================================================
// 3. REALTIME ACTIVITY LOG
// ============================================================================

let realtimeActivityLog: Array<{ timestamp: string; action: string; name?: string; event?: string }> = [];

export function startActivityLogging() {
  const { supabase } = require('@/lib/supabase');
  
  // Intercept channel creation
  const originalChannel = supabase.channel.bind(supabase);
  
  supabase.channel = function(name: string, options?: unknown) {
    realtimeActivityLog.push({
      timestamp: new Date().toISOString(),
      action: 'channel_created',
      name,
    });
    
    const channel = originalChannel(name, options);
    
    // Log subscribe calls
    const originalSubscribe = channel.subscribe.bind(channel);
    channel.subscribe = function(...args: unknown[]) {
      realtimeActivityLog.push({
        timestamp: new Date().toISOString(),
        action: 'subscribe_called',
        name,
      });
      return originalSubscribe(...args);
    };
    
    // Log .on() calls
    const originalOn = channel.on.bind(channel);
    channel.on = function(...args: unknown[]) {
      const eventArgs = args[1] as { event?: string } | undefined;
      realtimeActivityLog.push({
        timestamp: new Date().toISOString(),
        action: 'on_called',
        name,
        event: eventArgs?.event || 'unknown',
      });
      return originalOn(...args);
    };
    
    return channel;
  };
  
  console.log('✓ Activity logging started');
}

export function getActivityLog() {
  console.group('📋 Realtime Activity Log');
  console.table(realtimeActivityLog.slice(-20)); // Last 20 events
  console.groupEnd();
}

export function clearActivityLog() {
  realtimeActivityLog = [];
  console.log('✓ Activity log cleared');
}

// ============================================================================
// 4. DIAGNOSTIC REPORT
// ============================================================================

export function generateDiagnosticReport() {
  const { supabase } = require('@/lib/supabase');
  
  console.group('🔧 DIAGNOSTIC REPORT - Realtime Subscriptions');
  
  const channels = supabase.getChannels();
  
  console.log('--- SUMMARY ---');
  console.log(`Total channels: ${channels.length}`);
  console.log(`Report generated: ${new Date().toISOString()}`);
  
  console.log('\n--- CHANNEL DETAILS ---');
  channels.forEach((channel: { topic: string; state: string; listeners?: Array<unknown>; createdAt?: string }, index: number) => {
    console.log(`\n[${index + 1}] ${channel.topic}`);
    console.log(`  State: ${channel.state}`);
    console.log(`  Listeners: ${channel.listeners?.length || 0}`);
    console.log(`  Created at: ${channel.createdAt || 'N/A'}`);
  });
  
  console.log('\n--- POTENTIAL ISSUES ---');
  
  // Check for duplicate topics
  const topicMap: Record<string, number> = {};
  channels.forEach((ch: { topic: string }) => {
    topicMap[ch.topic] = (topicMap[ch.topic] || 0) + 1;
  });
  
  const duplicates = Object.entries(topicMap).filter(([_, count]) => count > 1);
  if (duplicates.length > 0) {
    console.error('❌ ISSUE: Duplicate channel topics found!');
    duplicates.forEach(([topic, count]) => {
      console.error(`  ${topic}: ${count} instances`);
    });
  }
  
  // Check for channels not subscribed
  const unsubscribed = channels.filter((ch: { state?: string }) => ch.state !== 'subscribed');
  if (unsubscribed.length > 0) {
    console.warn('⚠️ WARNING: Non-subscribed channels:');
    unsubscribed.forEach((ch: { topic: string; state?: string }) => {
      console.warn(`  ${ch.topic}: ${ch.state}`);
    });
  }
  
  if (duplicates.length === 0 && unsubscribed.length === 0) {
    console.log('✓ No issues detected');
  }
  
  console.groupEnd();
}

// ============================================================================
// 5. QUICK TEST COMMANDS
// ============================================================================

export function runQuickTest() {
  console.log('%c🧪 RUNNING QUICK TEST', 'color: blue; font-weight: bold');
  
  logActiveChannels();
  monitorChannelStates();
  generateDiagnosticReport();
  
  console.log('%c✓ Quick test complete', 'color: green; font-weight: bold');
}

// ============================================================================
// 6. CLEANUP DEAD CHANNELS
// ============================================================================

export function cleanupDeadChannels() {
  const { supabase } = require('@/lib/supabase');
  
  const channels = supabase.getChannels();
  const deadChannels = channels.filter((ch: { state?: string }) => 
    ch.state === 'CLOSED' || ch.state === 'CHANNEL_ERROR'
  );
  
  console.group('🧹 Cleaning up dead channels');
  console.log(`Found ${deadChannels.length} dead channels`);
  
  deadChannels.forEach((ch: { topic: string }) => {
    supabase.removeChannel(ch);
    console.log(`✓ Removed: ${ch.topic}`);
  });
  
  console.groupEnd();
}

// ============================================================================
// USAGE INSTRUCTIONS
// ============================================================================

export function printUsageInstructions() {
  console.log(`
%c═══════════════════════════════════════════════════════════════
   REALTIME DIAGNOSTICS - USAGE GUIDE
═══════════════════════════════════════════════════════════════

%cQUICK START:%c
  Run: window.realtimeDiagnostics.runQuickTest()

%cAVAILABLE COMMANDS:%c

1. logActiveChannels()
   → Lists all active Supabase Realtime channels
   → Shows state and listener count
   → Detects duplicates

2. monitorChannelStates()
   → Shows channels grouped by state (subscribed, error, etc)

3. startActivityLogging()
   → Logs all channel creation and subscription events
   → Useful for debugging subscription order issues

4. getActivityLog()
   → Shows last 20 activity events

5. clearActivityLog()
   → Clears the activity log

6. generateDiagnosticReport()
   → Full diagnostic report with potential issues

7. cleanupDeadChannels()
   → Removes channels in CLOSED or ERROR state

%cEXAMPLE WORKFLOW:%c
  window.realtimeDiagnostics.startActivityLogging();
  // ... perform actions that trigger subscriptions ...
  window.realtimeDiagnostics.getActivityLog();
  window.realtimeDiagnostics.logActiveChannels();
  window.realtimeDiagnostics.generateDiagnosticReport();

═══════════════════════════════════════════════════════════════
  `, 
  'color: cyan; font-size: 14px',
  'color: yellow; font-weight: bold',
  'color: cyan; font-size: 14px',
  'color: yellow; font-weight: bold',
  'color: cyan; font-size: 14px',
  'color: yellow; font-weight: bold',
  'color: cyan; font-size: 14px'
  );
}

// ============================================================================
// AUTO-EXPOSE TO WINDOW (for console access)
// ============================================================================

if (typeof window !== 'undefined') {
  (window as any).realtimeDiagnostics = {
    logActiveChannels,
    monitorChannelStates,
    startActivityLogging,
    getActivityLog,
    clearActivityLog,
    generateDiagnosticReport,
    cleanupDeadChannels,
    runQuickTest,
    printUsageInstructions,
  };
  
  console.log('%c✓ Realtime diagnostics ready. Type: window.realtimeDiagnostics.printUsageInstructions()', 'color: green; font-weight: bold');
}
