using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.Configuration;

namespace Wbs.Utilities.Configuration
{
    public class SuccessfulDependencyFilter : ITelemetryProcessor
    {
        private readonly string[] functions = new[] { "'Refresher'", "'Ping'" };
        private bool ShowAll { get; set; }
        private ITelemetryProcessor Next { get; set; }

        // next will point to the next TelemetryProcessor in the chain.
        public SuccessfulDependencyFilter(ITelemetryProcessor next, IConfiguration config)
        {
            Next = next;
            ShowAll = config["Telemetry:ShowAll"] == "true";
        }

        public void Process(ITelemetry item)
        {
            if (ShowAll)
            {
                Next.Process(item);
                return;
            }
            // To filter out an item, return without calling the next processor.
            if (DependencyTest(item) && TraceTest(item)) Next.Process(item);
        }

        // Example: replace with your own criteria.
        private bool DependencyTest(ITelemetry item)
        {
            var dependency = item as DependencyTelemetry;
            if (dependency == null) return true;
            if (dependency.Success ?? false) return false;
            //if (dependency.Properties["Category"]?.Contains(nameof(Utils.RunRefresherPeak)) ?? false) return false;

            return true;
        }

        // Example: replace with your own criteria.
        private bool TraceTest(ITelemetry item)
        {
            var trace = item as TraceTelemetry;
            if (trace == null) return true;
            // If not info or verbose, carry on.
            if (!(trace.SeverityLevel == SeverityLevel.Information || trace.SeverityLevel == SeverityLevel.Information)) return true;

            foreach (var r in functions)
            {
                if (trace.Message.Contains(r)) return false;
            }
            return true;
        }
    }
}
