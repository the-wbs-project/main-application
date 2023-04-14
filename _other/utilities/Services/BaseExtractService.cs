using System.Collections.Generic;
using System.Linq;

namespace Wbs.Utilities.Services
{
    public abstract class BaseExtractService
    {
        public bool TestFormat(string x)
        {
            foreach (var c in x)
            {
                if (!char.IsNumber(c) && c != '.') return false;
            }
            return true;
        }

        public bool TestLevels(string a, string b)
        {
            //
            //  Build options
            //
            var parts = a.Split('.').Select(x => int.Parse(x)).ToArray();
            var options = new List<string> { a + ".1" };

            for (var i = 0; i < parts.Length; i++)
            {
                if (i == 0) options.Add((parts[0] + 1).ToString());
                else
                {
                    var p = parts.Take(i).ToList();
                    p.Add(parts[i] + 1);

                    options.Add(string.Join('.', p));
                }
                    //options.Add(string.Join('.', parts.Take(i), parts[0] + 1));
            }
            return options.Contains(b);
        }
    }
}