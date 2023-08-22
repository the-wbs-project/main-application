DROP TABLE dbo.Resources
GO

CREATE TABLE dbo.Resources (
    Locale nvarchar(10) NOT NULL,
    Section nvarchar(100) NOT NULL,
    Name nvarchar(100) NOT NULL,
    Value nvarchar(MAX) NOT NULL,
    CONSTRAINT PK_Resources PRIMARY KEY CLUSTERED (Locale ASC, Section ASC, Name ASC)
)