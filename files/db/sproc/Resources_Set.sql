
CREATE PROCEDURE [dbo].[Resources_Set]
	@Locale [nvarchar](10),
	@Section [nvarchar](100),
	@JsonValues [nvarchar](MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	MERGE dbo.Resources AS target  
		USING (
			SELECT [key] COLLATE SQL_Latin1_General_CP1_CI_AS as [Name],
			[value] COLLATE SQL_Latin1_General_CP1_CI_AS as [Value] 
			FROM OPENJSON (@JsonValues)) AS source ([Name], [Value])  
		ON (
			target.[Locale] = @Locale AND
			target.[Section] = @Section AND
			target.[Name] = source.[Name])
		WHEN NOT MATCHED AND source.[Value] IS NOT NULL THEN
			INSERT ([Locale], [Section], [Name], [Value]) VALUES (@Locale, @Section, [Name], [Value])
		WHEN MATCHED THEN
			UPDATE SET [Value] = source.[Value];
END
