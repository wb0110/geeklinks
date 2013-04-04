//
//  main.cpp
//  citydb
//
//  Created by Amir Moravej on 2013-04-03.
//  Copyright (c) 2013 Amir Moravej. All rights reserved.
//

#include <iostream>
#include <fstream>
#include <sstream>
using namespace std;

int main(int argc, const char * argv[])
{    
    long begin, end;
    string line, stemp, city, cityAccent, region, pop, lat, lon;
    ifstream file;
    int i = 0, index = 3, beginIndex;
    
    file.open ("cities.txt");
    if (file.is_open())
    {
        cout << "\n"<<"The read file is open.";
        begin = file.tellg();
        file.seekg (0, ios::end);
        end = file.tellg();
        cout << " Size is: " << (end-begin) << " bytes.\n";
        file.seekg (0, ios::beg);
        while (file.good() && i < 2)
        {
            getline (file,line);
            cout << line << "\t"<< line.length() << endl;
            if (i == 1)
            {
                for (index = 3; index < line.length() && line[index] != ','; ++index);
                if (index == line.length()) break;
                city = line.substr(3, index - 3);
                cout << endl<<city << endl;
                
                for (++index, beginIndex = index; index < line.length() && line[index] != ','; ++index);
                if (index == line.length()) break;
                cityAccent = line.substr(beginIndex, index - beginIndex);
                cout << cityAccent<<endl;
                if (index == line.length()) break;
                
                for (++index, beginIndex = index; index < line.length() && line[index] != ','; ++index);
                if (index == line.length()) break;
                region = line.substr(beginIndex, index - beginIndex);
                cout << region<<endl;
                if (index == line.length()) break;
                
                for (++index, beginIndex = index; index < line.length() && line[index] != ','; ++index);
                if (index == line.length()) break;
                pop = line.substr(beginIndex, index - beginIndex);
                cout << pop<<endl;
                if (index == line.length()) break;
                
                for (++index, beginIndex = index; index < line.length() && line[index] != ','; ++index);
                if (index == line.length()) break;
                lat = line.substr(beginIndex, index - beginIndex);
                cout << lat<<endl;
                if (index == line.length()) break;
                
                for (++index, beginIndex = index; index < line.length() && line[index] != ','; ++index);
                lon = line.substr(beginIndex, line.length() );
                cout << lon<<endl;
            }
            ++i;
        }
        file.close();
    }
    else cout << "Unable to open file";
    
    return 0;
}
 /**/


